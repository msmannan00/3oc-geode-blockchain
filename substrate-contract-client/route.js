const express = require('express');
const router = express.Router();
const ContractController = require('./services/contract/contractController');
const contractController = new ContractController();

router.get('/contract/:contractAddress/value', async (req, res) => {
  const {contractAddress} = req.params;
  try {
    const value = await contractController.getContractValue(contractAddress);
    res.json({success: true, data: value});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

router.post('/contract/:contractAddress/flip', async (req, res) => {
  const {contractAddress} = req.params;
  try {
    const newValue = await contractController.flipContractState(contractAddress);
    res.json({success: true, data: newValue});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

router.post('/deploy', async (req, res) => {
  try {
    const txHash = await contractController.deployContract();
    res.status(200).json({message: '', txHash});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.post('/build', async (req, res) => {
  try {
    contractController.buildContract();
    res.status(200).json({message: 'Contract Built successfully'});
  } catch (error) {
    console.error('Error building contract:', error.message);
    res.status(500).json({error: error.message});
  }
});

module.exports = router;
