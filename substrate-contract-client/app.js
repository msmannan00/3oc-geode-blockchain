const { ApiPromise, WsProvider } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');
const { Keyring } = require('@polkadot/keyring');
const fs = require('fs');

// Connect to the Substrate node
const wsProvider = new WsProvider('ws://127.0.0.1:9944');

async function main() {
    // Create an API instance
    const api = await ApiPromise.create({ provider: wsProvider });

    // Read the contract ABI and WASM files
    const abi = JSON.parse(fs.readFileSync('./abi/target/ink/flipper.json', 'utf8'));

    // Create a contract instance
    const contract = new ContractPromise(api, abi, '5GSqZs2rLFpz4mGqdUv7xcoBiuNA8mreoW9A46TAxFMca5Uz');

    // Create a keyring instance and add the Alice account
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');

    // Define the function call parameters
    const value = 0; // Sending 0 units
    const gasLimit = api.registry.createType('WeightV2', {
        refTime: 2000000000, // Adjusted higher refTime
        proofSize: 131072,  // Adjusted higher proofSize
    });

    try {
        // Call the contract function that modifies state
        const txHash = await contract.tx.flip({ gasLimit, value }).signAndSend(alice, (result) => {
            if (result.status.isInBlock) {
                console.log('Transaction included at blockHash', result.status.asInBlock.toHex());
            } else if (result.status.isFinalized) {
                console.log('Transaction finalized at blockHash', result.status.asFinalized.toHex());
            }
        });

        console.log(`Transaction sent with hash: ${txHash}`);

        // Wait for transaction finalization
        await new Promise(resolve => setTimeout(resolve, 6000));

        // Query the updated state
        const { result, output } = await contract.query.get(alice.address, { value, gasLimit });

        // Check for errors in the result
        if (result.isOk) {
            if (output) {
                console.log(`Result: ${output.toString()}`);
            } else {
                console.log('No result returned from contract call');
            }
        } else {
            console.error(`Error: ${result.asErr}`);
        }
    } catch (error) {
        console.error(`Caught error: ${error.message}`);
    }

    // Disconnect from the node
    api.disconnect();
}

main().catch(console.error);
