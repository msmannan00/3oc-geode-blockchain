// server.js

const express = require('express');
const cors = require('cors');
const { getContractValue, flipContractState,deployContract, BuildContract } = require('./conn'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.get('/contract/:contractAddress/value', async (req, res) => {
    const { contractAddress } = req.params;
    try {
        const value = await getContractValue(contractAddress);
        res.json({ success: true, data: value });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post('/contract/:contractAddress/flip', async (req, res) => {
    const { contractAddress } = req.params;
    try {
        const newValue = await flipContractState(contractAddress);
        res.json({ success: true, data: newValue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});




app.post('/deploy', async (req, res) => {
    try {
        const txHash = await deployContract(); // Get transaction hash from deployContract        
        res.status(200).json({ message: 'Contract deployed successfully', txHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/build', async (req, res) => {
    try {
        // Run the asynchronous function to get the directory path
        const dirPath = await BuildContract();
        console.log('Server path:', dirPath);

        // Send a successful response with the directory path
        res.status(200).json({ message: 'Contract Built successfully', dirPath });
    } catch (error) {
        console.error('Error building contract:', error.message);

        // Send an error response
        res.status(500).json({ error: error.message });
    }
});

//-----------------------------------------

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
