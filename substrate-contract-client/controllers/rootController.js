class RootController {
    constructor(loaderId, buildResultId, deployResultId, contractPathId, contractAddressId, resultId) {
        this.loader = document.getElementById(loaderId);
        this.buildResult = document.getElementById(buildResultId);
        this.deployResult = document.getElementById(deployResultId);
        this.contractAddress = document.getElementById(contractAddressId);
        this.result = document.getElementById(resultId);

        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('buildbtn').addEventListener('click', () => this.buildContract());
        document.getElementById('deployBtn').addEventListener('click', () => this.deployContract());
        document.getElementById('getValueBtn').addEventListener('click', () => this.fetchContractValue());
        document.getElementById('flipStateBtn').addEventListener('click', () => this.flipContractState());
    }

    showLoader() {
        this.loader.style.display = 'block';
    }

    hideLoader() {
        this.loader.style.display = 'none';
    }

    buildContract() {
        this.showLoader();
        try {
            fetch(`/build`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            this.buildResult.innerText = 'Smart Contract build triggered successfully';
        } finally {
            this.hideLoader();
        }
    }

    async deployContract() {
        this.showLoader();
        try {
            const response = await fetch(`/deploy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.txHash) {
                this.deployResult.innerText = `Transaction Hash: ${data.txHash}`;
                this.contractAddress.value = data.txHash;
            } else {
                this.deployResult.innerText = data.error;
            }
        } catch (error) {
            console.error('Error:', error);
            this.deployResult.innerText = data.error;
        } finally {
            this.hideLoader();
        }
    }

    async fetchContractValue() {
        const contractAddress = this.contractAddress.value;
        try {
            const response = await fetch(`/contract/${contractAddress}/value`);
            const result = await response.json();

            if (result.success) {
                this.result.innerText = `Contract Value: ${JSON.stringify(result.data)}`;
            } else {
                this.result.innerText = `Error: ${result.message}`;
            }
        } catch (error) {
            console.error('Error:', error);
            this.result.innerText = 'An error occurred. Please try again.';
        }
    }

    async flipContractState() {
        this.showLoader();
        try {
            const contractAddress = this.contractAddress.value;
            const response = await fetch(`/contract/${contractAddress}/flip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();

            if (result.success) {
                this.result.innerText = `Flipped Contract State. New Value: ${JSON.stringify(result.data)}`;
            } else {
                this.result.innerText = `Error: ${result.message}`;
            }
        } catch (error) {
            console.error('Error:', error);
            this.result.innerText = `Error: ${result.message}`;
        } finally {
            this.hideLoader();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RootController('loader', 'buildResult', 'deployResult', 'contractpath', 'contractAddress', 'result');
});

