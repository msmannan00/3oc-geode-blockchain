
module.exports = {
    wsProvider: 'ws://127.0.0.1:9944',
    abiFile: '/flipper.json', 
    wasmFile: '/flipper.wasm', 
    aliceKey: '//Alice', 
    gasLimit: {
        refTime: 2000000000, 
        proofSize: 131072, 
    },
};
