// contract.js

const { ApiPromise, WsProvider } = require('@polkadot/api');
const { ContractPromise, CodePromise } = require('@polkadot/api-contract');
const { Keyring } = require('@polkadot/keyring');
const fs = require('fs');
const config = require('./config'); // Import configuration values

// Function to connect to the Substrate node
async function connectToNode() {
    const wsProvider = new WsProvider(config.wsProvider);
    return await ApiPromise.create({ provider: wsProvider });
}

const abi = JSON.parse(fs.readFileSync(config.abiFile, 'utf8'));
const keyring = new Keyring({ type: 'sr25519' });
const value = 0; // Sending 0 units

//------------------------------------------

// Function to deploy the contract
async function deployContract() {
    console.log("Config-deploye calls");
    const api = await connectToNode();
    const alice = keyring.addFromUri(config.aliceKey); // Account to deploy from
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);
    
    // Create contract instance for deployment (use the ABI of your contract)
    const contract = new CodePromise(api, abi, null);
    
    try {
        const { gasRequired, result, events } = await contract.tx
            .new(/* constructor args if any */) // Replace with your constructor arguments if needed
            .signAndSend(alice, { value: 0, gasLimit }, ({ status }) => {
                if (status.isInBlock) {
                    console.log(`Contract deployed in block: ${status.asInBlock}`);
                } else if (status.isFinalized) {
                    console.log(`Contract finalized in block: ${status.asFinalized}`);
                    // Log any events emitted during the contract deployment
                    events.forEach(({ event }) => {
                        console.log(`📦 Event: ${event.section}.${event.method}`);
                    });
                }
            });

        if (result.isOk) {
            console.log(result.toHex());
            return result.toHex(); // Return transaction hash
        } else {
            throw new Error(result.asErr.toString());
        }

    } catch (error) {
        console.error(`Caught error during contract deployment: ${error.message}`);
        throw error; // Rethrow error for handling in the server
    } finally {
        await api.disconnect();
    }
}
//-----------------------------------------




// Function to get the contract value
async function getContractValue(contractAddress) {
    const api = await connectToNode();
    const contract = new ContractPromise(api, abi, contractAddress);
    const alice = keyring.addFromUri(config.aliceKey);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);
   

    try {
        const { result, output } = await contract.query.get(alice.address, { value, gasLimit });

        await api.disconnect();

        if (result.isOk) {
            return output ? output.toHuman() : 'No result returned from contract call';
        } else {
            throw new Error(result.asErr.toString());
        }
    } catch (error) {
        console.error(`Caught error: ${error.message}`);
        throw error;
    }
}

// Function to flip the contract state and get the new value
async function flipContractState(contractAddress) {
    const api = await connectToNode();
    //const abi = JSON.parse(fs.readFileSync(config.abiFile, 'utf8'));
    const contract = new ContractPromise(api, abi, contractAddress);
    //const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri(config.aliceKey);

    //const value = 0; // Sending 0 units
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);

    try {
        const txHash = await contract.tx.flip({ gasLimit, value }).signAndSend(alice, (result) => {
            // if (result.status.isInBlock) {
            //     console.log('Transaction included at blockHash', result.status.asInBlock.toHex());
            // } else if (result.status.isFinalized) {
            //     console.log('Transaction finalized at blockHash', result.status.asFinalized.toHex());
            // }
        });

        //console.log(`Transaction sent with hash: ${txHash}`);

        // Wait for transaction finalization
        await new Promise(resolve => setTimeout(resolve, 6000));

        // Query the updated state
        const newValue = await getContractValue(contractAddress);
        return newValue;
    } catch (error) {
        console.error(`Caught error: ${error.message}`);
        throw error;
    } finally {
        await api.disconnect();
    }
}

// Export functions for external use
module.exports = {
    deployContract,
    getContractValue,
    flipContractState,
};
