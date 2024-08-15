// server.js

const express = require('express');
const cors = require('cors');
const { getContractValue, flipContractState,deployContract } = require('./conn'); // Import functions from contract.js

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to get the contract value
app.get('/contract/:contractAddress/value', async (req, res) => {
    const { contractAddress } = req.params;
    try {
        const value = await getContractValue(contractAddress);
        res.json({ success: true, data: value });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint to flip the contract state and get the new value
app.post('/contract/:contractAddress/flip', async (req, res) => {
    const { contractAddress } = req.params;
    try {
        const newValue = await flipContractState(contractAddress);
        res.json({ success: true, data: newValue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ------------ deploy contract --------------

// Endpoint to deploy contract
app.post('/deploy', async (req, res) => {
    try {
        console.log("deploye calls");
        const txHash = await deployContract(); // Get transaction hash from deployContract
        res.status(200).json({ message: 'Contract deployed successfully', txHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//-----------------------------------------

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
