const {ApiPromise, WsProvider, Keyring} = require('@polkadot/api');
const {ContractPromise, CodePromise} = require('@polkadot/api-contract');
const fs = require('fs');
const config = require('../../shared/config');
const {buildContract} = require('../../shared/helperMethod');
const path = require('path');

class ContractController {
  constructor() {
    const projectRoot = process.cwd();
    this.keyring = new Keyring({type: 'sr25519'});
    this.value = 0;
    this.wasm = null;
    this.abi = null;

    this.wasmFilePath = path.join(projectRoot, config.wasmFile);
    this.abiFilePath = path.join(projectRoot, config.abiFile);
    this.initializeFiles().then();
  }

  async initializeFiles() {
    if (fs.existsSync(this.wasmFilePath) && fs.existsSync(this.abiFilePath)) {
      await this.readFiles();
    }
  }

  async connectToNode() {
    const wsProvider = new WsProvider(config.wsProvider);
    return ApiPromise.create({provider: wsProvider});
  }

  async readFiles() {
    this.wasm = fs.readFileSync(this.wasmFilePath);
    this.abi = JSON.parse(fs.readFileSync(this.abiFilePath, 'utf8'));
  }

  async buildContract() {
    await buildContract();
    if (fs.existsSync(this.wasmFilePath) && fs.existsSync(this.abiFilePath)) {
      await this.readFiles();
      return this.abiFilePath;
    } else {
      throw Error("Contract files not found");
    }
  }

  async deployContract() {
    if (!fs.existsSync(this.wasmFilePath) || !fs.existsSync(this.abiFilePath)) {
      return "Contract not deployed";
    }

    const api = await this.connectToNode();
    const alice = this.keyring.addFromUri(config.aliceKey);
    const code = new CodePromise(api, this.abi, this.wasm);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);
    const storageDepositLimit = null;

    return new Promise((resolve, reject) => {
      code.tx.new({gasLimit, value: 0}, storageDepositLimit)
        .signAndSend(alice, {nonce: -1}, (result) => {
          if (result.status.isInBlock) {
            result.events.forEach(({event: {data, method, section}}) => {
              if (section === 'contracts' && method === 'Instantiated') {
                const [creator, contractAddress] = data;
                console.log("Contract Address: " + contractAddress.toString());
                resolve(contractAddress.toString());
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

  async getContractValue(contractAddress) {
    if (!fs.existsSync(this.wasmFilePath) || !fs.existsSync(this.abiFilePath)) {
      return "Contract not deployed";
    }

    const api = await this.connectToNode();
    const contract = new ContractPromise(api, this.abi, contractAddress);
    const alice = this.keyring.addFromUri(config.aliceKey);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);

    const {result, output} = await contract.query.get(alice.address, {value: this.value, gasLimit});
    await api.disconnect();

    if (result.isOk) {
      return output ? output.toHuman() : 'No result returned from contract call';
    } else if (result.isErr) {
      const error = result.asErr;
      if (error.isModule) {
        const decoded = api.registry.findMetaError(error.asModule);
        const {documentation, name, section} = decoded;

        if (error.asModule.index.eq(8) && error.asModule.error.eq('0x06000000')) {
          throw Error('Contract not found');
        }
        throw Error(`${section}.${name}: ${documentation.join(' ')}`);
      } else {
        throw Error(`Transaction failed with error: ${error.toString()}`);
      }
    }
  }

  async flipContractState(contractAddress) {
    if (!fs.existsSync(this.wasmFilePath) || !fs.existsSync(this.abiFilePath)) {
      return "Contract not deployed";
    }

    const api = await this.connectToNode();
    const contract = new ContractPromise(api, this.abi, contractAddress);
    const alice = this.keyring.addFromUri(config.aliceKey);
    const gasLimit = api.registry.createType('WeightV2', config.gasLimit);

    try {
      await contract.tx.flip({gasLimit, value: this.value}).signAndSend(alice, async (result) => {
        if (result.isError) {
          const error = result.dispatchError;
          if (error.isModule) {
            const decoded = api.registry.findMetaError(error.asModule);
            const {documentation, name, section} = decoded;

            if (error.asModule.index.eq(8) && error.asModule.error.eq('0x06000000')) {
              throw Error('Contract not found');
            }
            throw Error(`${section}.${name}: ${documentation.join(' ')}`);
          } else {
            throw Error(`Transaction failed with error: ${error.toString()}`);
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 6000));
      return await this.getContractValue(contractAddress);
    } catch (error) {
      console.error(`Caught error: ${error.message}`);
      throw error;
    } finally {
      await api.disconnect();
    }
  }
}

module.exports = ContractController;
