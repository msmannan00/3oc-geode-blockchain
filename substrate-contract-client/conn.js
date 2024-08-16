// contract.js

const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { ContractPromise, CodePromise } = require('@polkadot/api-contract');
const fs = require('fs');
const config = require('./config');
const {runCommandsSequentially} = require('./BuildContract'); 


//------------------------------- ------------
var contDirPath ;
var wasm;
var abi;
const keyring = new Keyring({ type: 'sr25519' });
const value = 0; 
//------------------------------------------


async function connectToNode() {
    const wsProvider = new WsProvider(config.wsProvider);
    return await ApiPromise.create({ provider: wsProvider });
}
async function readfiles() {
wasm = fs.readFileSync(contDirPath+config.wasmFile);
abi = JSON.parse(fs.readFileSync(contDirPath+config.abiFile, 'utf8'));
return true;
}
 
async function BuildContract() {
    try {
        const result = await runCommandsSequentially();
        contDirPath = result;
        if(readfiles())
        {
            return result; 
        }else{
            return "unable to read files"
        }
        
    } catch (error) {
        console.error('Failed to execute commands:', error.message);
        throw error; 
    }
}


async function deployContract() {
    const api = await connectToNode();
    const alice = keyring.addFromUri(config.aliceKey);
    const code = new CodePromise(api, abi, wasm);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);
    const storageDepositLimit = null; 

    return new Promise((resolve, reject) => {
        const unsub = code.tx.new({ gasLimit, value: 0 }, storageDepositLimit)
            .signAndSend(alice, { nonce: -1 }, (result) => {
                if (result.status.isInBlock) {
                    result.events.forEach(({ event: { data, method, section } }) => {
                        if (section === 'contracts' && method === 'Instantiated') {
                            const [creator, contractAddress] = data;
                            console.log("Contract Address: " + contractAddress.toString());
                            resolve(contractAddress.toString()); // Resolve with the contract address
                        }
                    });
                } else if (result.status.isFinalized) {
                    console.log('Transaction finalized at blockHash: ' + result.status.asFinalized.toString());
                    
                } else if (result.isError) {
                    console.log('Deployment failed with an error');
                    reject(new Error('Deployment failed with an error'));
                    
                }
            
            });
        });
    
}


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


async function flipContractState(contractAddress) {
    const api = await connectToNode();
    const contract = new ContractPromise(api, abi, contractAddress);
    const alice = keyring.addFromUri(config.aliceKey);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);

    try {
        const txHash = await contract.tx.flip({ gasLimit, value }).signAndSend(alice, (result) => {
        });

        await new Promise(resolve => setTimeout(resolve, 6000));

        // Query the updated state
        const newValue = await getContractValue(contractAddress);
        return newValue;
    } catch (error) {
        throw error;
    } finally {
        await api.disconnect();
    }
}



module.exports = {
    deployContract,
    getContractValue,
    flipContractState,
    BuildContract,
};