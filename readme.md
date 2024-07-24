# 3OC Smart Contract API

This repository contains a Substrate contracts node and a client to interact with it. The setup includes building and deploying a sample Ink! smart contract.

## Prerequisites

Ensure you have the following installed on your system:
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/)
- [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)

## Installation

### Step 1: Install Rust and Required Components

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup component add rust-src --toolchain nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```
### Step 2: Build and Run Substrate Contracts Node
```
cd substrate-contract-node
cargo build --release
./target/release/substrate-contracts-node --dev
```

### Step 3: Set Up the Client
```
cd substrate-contract-client
npm install 
cargo install cargo-contract --force --locked
```

### Step 4: Build the Ink! Smart Contract
```
cd abi
cargo +nightly contract build
```
### Step 5: Run the Client Application
Do the following to deploy smar contract on blockchain development environment

#### 1. Open Ink! UI:
    Go to https://ui.use.ink/.
#### 2. Switch to Local Node:
    Click the Settings icon (gear).
    Under Node, select Custom Endpoint and enter ws://127.0.0.1:9944.
    Click Save & Reload.
#### 3. Upload Contract:
    Go to Deploy Contracts > Upload New Contract.
    Select substrate-contract-client/abi/target/ink/flipper.contract.
#### 4. Deploy Contract:
    Set initial parameters if needed.
    Select your account (e.g., Alice).
    Click Deploy and confirm.
#### 5. Copy and Replace Hash:
    Copy the displayed contract hash after deployment.
    Replace the old hash in your code with the new one.

### Step 6: Run the Client Application
```
cd ..
node app.js
```

## Project Structure

substrate-contract-node: Contains the Substrate node configured for contracts.
substrate-contract-client: Node.js client to interact with the Substrate node.
abi: Directory containing the Ink! smart contract source and build files.

## Usage 

Follow the installation steps to set up and run the Substrate node and client. After running the node and client application, you can interact with the deployed smart contract.
