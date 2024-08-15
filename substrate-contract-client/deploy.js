const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const fs = require('fs');

const deployContract = async () => {
    // Connect to the Substrate node
    const provider = new WsProvider('wss://westend.api.onfinality.io/public-ws'); // Change this to your node
    const api = await ApiPromise.create({ provider });

    // Create a keyring instance and add your account
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromUri('//Alice'); // Replace with your mnemonic or keypair

    // Read the compiled contract's wasm and abi files
    const wasm = fs.readFileSync('./flipper/target/ink/flipper.wasm'); // Update the path
    const abi = JSON.parse(fs.readFileSync('./flipper/target/ink/flipper.json', 'utf-8')); // Update the path

    // Deploy the contract
    const gasLimit = api.registry.createType(131072, 1000000000); // Adjust as needed
    const storageDepositLimit = null; // Can be adjusted to a specific amount if required

    // Assuming the constructor takes no arguments
    const tx = api.tx.contracts.deployWithCode(
        gasLimit,
        storageDepositLimit,
        wasm,
        abi
    );

    // Sign and send the transaction
    const unsub = await tx.signAndSend(account, ({ status }) => {
        if (status.isInBlock) {
            console.log(`Contract deployed with hash ${tx.hash.toHex()}`);
            unsub();
        } else if (status.isFinalized) {
            console.log(`Finalized block hash: ${status.asFinalized.toHex()}`);
        }
    });
};

// Execute the deploy function
deployContract().catch(console.error);






















// const { ApiPromise, WsProvider } = require('@polkadot/api');
// const { Keyring } = require('@polkadot/api'); 
// const { ContractPromise } = require('@polkadot/api-contract');
// const fs = require('fs');

// async function main() {
//     // Connect to the local Substrate node
//     const provider = new WsProvider('ws://localhost:9944');
//     const api = await ApiPromise.create({ provider });
//     const keyring = new Keyring({ type: 'sr25519' });

//     // Create an account (use a pre-funded account for deployment)
//     const alice = keyring.addFromUri('//Alice'); // Use the Alice account for this example

//     // Load the contract metadata
//     const contractMeta = JSON.parse(fs.readFileSync('./flipper/target/ink/flipper.json')); // Update with your path
//     const wasm = fs.readFileSync('./flipper/target/ink/flipper.wasm'); // Update with your path

//     // Create a contract instance
//     const contract = new ContractPromise(api, contractMeta, null);

//     // Deploy the contract
//     const { gasRequired, result, gasConsumed, events } = await contract.tx
//         .get(/* constructor arguments here, if any */)
//         .signAndSend(alice, { value: 0, gasLimit: -1 }, ({ status }) => {
//             if (status.isInBlock) {
//                 console.log(`✅ Contract deployed in block: ${status.asInBlock}`);
//             } else if (status.isFinalized) {
//                 console.log(`✅ Contract finalized in block: ${status.asFinalized}`);
//                 // Here you can also log any events emitted by the contract
//                 events.forEach(({ event }) => {
//                     console.log(`\t📦 Event: ${event.section}.${event.method}`);
//                 });
//             }
//         });
    
//     console.log(`Gas required: ${gasRequired}, Gas consumed: ${gasConsumed}`);
// }

// main().catch(console.error);











