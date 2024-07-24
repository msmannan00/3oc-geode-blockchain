polkadot how to call deployed smart contract function, complete code
2/2
ChatGPT

Here's a complete example of how to call a deployed smart contract function using Polkadot JS API. This example assumes you have the necessary dependencies installed and are familiar with using the Polkadot JS API.

    Install Dependencies

Ensure you have the necessary dependencies installed:

bash

npm install --save @polkadot/api @polkadot/types

    Complete Code Example

This example demonstrates how to call the get function of a deployed smart contract using the Polkadot JS API.

javascript

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
  const abi = JSON.parse(fs.readFileSync('./target/ink/hello_world.json', 'utf8'));
  const wasm = fs.readFileSync('./target/ink/hello_world.wasm');

  // Create a contract instance
  const contract = new ContractPromise(api, abi, '5CSG3mpPb7p1pWbcGBvLE9NPoqNfeWfGgtSgBSHr71x6QPJB');

  // Create a keyring instance and add the Alice account
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  // Define the function call parameters
  const value = 0; // Sending 0 units
  const gasLimit = -1; // Use default gas limit

  // Call the contract function
  const { output } = await contract.query.get(alice.address, { value, gasLimit });

  // Display the result
  if (output) {
    console.log(`Result: ${output.toString()}`);
  } else {
    console.log('No result returned from contract call');
  }

  // Disconnect from the node
  api.disconnect();
}

main().catch(console.error);

This script connects to a local Substrate node, reads the ABI and WASM files, creates a contract instance, and then calls the get function of the deployed smart contract. The result of the function call is printed to the console. Ensure that the ABI and WASM file paths and the contract address match your actual deployment details.
also add         refTime: 509238432,
        proofSize: 26893
and check if error was returned
ChatGPT

Here is the updated code that includes setting refTime and proofSize and checking for errors during the contract call:

javascript

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
  const abi = JSON.parse(fs.readFileSync('./target/ink/hello_world.json', 'utf8'));
  const wasm = fs.readFileSync('./target/ink/hello_world.wasm');

  // Create a contract instance
  const contract = new ContractPromise(api, abi, '5CSG3mpPb7p1pWbcGBvLE9NPoqNfeWfGgtSgBSHr71x6QPJB');

  // Create a keyring instance and add the Alice account
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  // Define the function call parameters
  const value = 0; // Sending 0 units
  const gasLimit = api.registry.createType('WeightV2', {
    refTime: 509238432,
    proofSize: 26893,
  });

  try {
    // Call the contract function
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

In this updated version, the gas limit is defined using refTime and proofSize. The result of the contract call is checked for errors, and any errors are logged to the console. The code also includes error handling for any exceptions that might be thrown during the contract call.
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
    const abi = JSON.parse(fs.readFileSync('./abi/target/ink/hello_world.json', 'utf8'));
    const wasm = fs.readFileSync('./abi/target/ink/hello_world.wasm');

    // Create a contract instance
    const contract = new ContractPromise(api, abi, '5Cwk3ziN3ewo3i1xysGtTYmvqwS7djU5hmAqMzb7QyfGLrT2');

    // Create a keyring instance and add the Alice account
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');

    // Define the function call parameters
    const value = 0; // Sending 0 units
    const gasLimit = api.registry.createType('WeightV2', {
        refTime: 509238432,
        proofSize: 26893,
    });

    try {
        // Call the contract function
        const { result, output } = await contract.query.flip('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', { value, gasLimit });

        // Check for errors in the result
        if (result.isOk) {
            if (output) {
                console.log(Result: ${output.toString()});
            } else {
                console.log('No result returned from contract call');
            }
        } else {
            console.error(Error: ${result.asErr});
        }
    } catch (error) {
        console.error(Caught error: ${error.message});
    }

    // Disconnect from the node
    api.disconnect();
}

main().catch(console.error);
how to run substrate contract node
ChatGPT

To run a Substrate contract node, you'll need to follow these steps:

    Install Rust: Ensure you have Rust installed. If not, you can install it using the following command:

    bash

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Install Substrate: Install the required Substrate dependencies and set up your development environment. You can follow the official Substrate Developer Hub installation guide.

Clone Substrate Node Template: Clone the Substrate Node Template repository, which provides a basic framework for running a Substrate node.

bash

git clone https://github.com/substrate-developer-hub/substrate-node-template
cd substrate-node-template

Build the Node: Build the Substrate node using Cargo.

bash

cargo build --release

Run the Node: Run the compiled node binary.

bash

    ./target/release/node-template --dev

This command runs the node in development mode, which is suitable for local testing and development.

    Deploy a Smart Contract: To deploy a smart contract on your local node, you can use the Polkadot.js Apps UI. Connect to your local node by selecting the local endpoint (ws://127.0.0.1:9944) in the network settings. Use the Contracts tab to upload and deploy your WASM contract.

Here is a summary of the commands and steps for setting up and running a Substrate contract node:
Step-by-Step Commands

    Install Rust:

    bash

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Set up your Substrate development environment (follow the installation guide).

Clone Substrate Node Template:

bash

git clone https://github.com/substrate-developer-hub/substrate-node-template
cd substrate-node-template

Build the node:

bash

cargo build --release

Run the node:

bash

    ./target/release/node-template --dev

After running these steps, your Substrate node should be up and running locally. You can interact with it using the Polkadot.js Apps UI to deploy and manage your smart contracts.
no i meant substate contract node
ChatGPT

To run a Substrate contract node specifically designed for smart contracts, you should use the substrate-contracts-node which includes support for the contracts pallet. Here are the steps to set up and run a Substrate contracts node:
Step-by-Step Guide

    Install Rust: Ensure you have Rust installed.

    bash

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Install Substrate prerequisites:

bash

rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

Clone the Substrate Contracts Node:

bash

git clone https://github.com/paritytech/substrate-contracts-node.git
cd substrate-contracts-node

Build the Node:

bash

cargo build --release

Run the Node:

bash

    ./target/release/substrate-contracts-node --dev

This will run the node in development mode, which is suitable for local testing and development.
Full Commands for Reference

    Install Rust:

    bash

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Install Substrate prerequisites:

bash

rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

Clone the Substrate Contracts Node:

bash

git clone https://github.com/paritytech/substrate-contracts-node.git
cd substrate-contracts-node

Build the Node:

bash

cargo build --release

Run the Node:

bash

    ./target/release/substrate-contracts-node --dev

By following these steps, you'll have a Substrate contracts node running locally, which you can use to deploy and interact with smart contracts. You can then use the Polkadot.js Apps UI or your own scripts to interact with the node.
also create sample smart contract
ChatGPT

Sure! Below is an example of an Ink! smart contract written in Rust, which you can use with the Substrate contracts pallet. This example demonstrates a simple Flipper contract that has a boolean state that can be toggled.
Step-by-Step Guide to Create a Sample Ink! Smart Contract

    Set Up Your Environment:
        Ensure you have Rust installed.
        Add the required toolchains and targets:

        bash

    rustup component add rust-src --toolchain nightly
    rustup target add wasm32-unknown-unknown --toolchain nightly

Install Cargo Contract:

    cargo-contract is a CLI tool to help you develop and manage Ink! smart contracts.

    bash

    cargo install cargo-contract --force --locked

Create a New Ink! Project:

bash

    cargo contract new flipper
    cd flipper

    Edit the Contract:
        Open lib.rs in the flipper folder and modify it to match the following simple contract:

rust

#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod flipper {
    #[ink(storage)]
    pub struct Flipper {
        value: bool,
    }

    impl Flipper {
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert_eq!(flipper.get(), false);
            flipper.flip();
            assert_eq!(flipper.get(), true);
        }
    }
}

    Build the Contract:

    bash

    cargo +nightly contract build

    Deploy the Contract:

        Use the Polkadot.js Apps UI or CLI to deploy your contract. Here is a basic example using Polkadot.js Apps:
        Go to Polkadot.js Apps.
        Connect to your local node (ws://127.0.0.1:9944).
        Navigate to the "Contracts" tab.
        Click on "Upload & deploy code".
        Upload the .contract file from the target/ink directory.
        Set the initial parameters and deploy.

By following these steps, you will have a simple Ink! smart contract deployed on your Substrate node, and you can interact with it using the Polkadot.js Apps UI or via the Polkadot.js API in your scripts.
Summary of Commands

    Set Up Rust Toolchain:

    bash

rustup component add rust-src --toolchain nightly
rustup target add wasm32-unknown-unknown --toolchain nightly

Install Cargo Contract:

bash

cargo install cargo-contract --force --locked

Create a New Ink! Project:

bash

cargo contract new flipper
cd flipper

Build the Contract:

bash

    cargo +nightly contract build

After these steps, you should have a working smart contract that can be deployed and interacted with on your Substrate contracts node.
ChatGPT can make mistakes. Check important info.