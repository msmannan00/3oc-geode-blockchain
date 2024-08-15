
module.exports = {
    wsProvider: 'ws://127.0.0.1:9944', // WebSocket provider URL
    contractAddress: '5GVKuQxU5c7BXv55gFfZVGtqxRPijf2pbfT72ZYhQy2SvLDo', // Contract address
    abiFile: './flipper/target/ink/flipper.json', // Path to contract ABI file
    wasmFile: './flipper/target/ink/flipper.wasm', // Path to wasm contract ABI file
    aliceKey: '//Alice', // Alice account key
    gasLimit: {
        refTime: 2000000000, // Adjusted higher refTime
        proofSize: 131072, // Adjusted higher proofSize
    },
};
