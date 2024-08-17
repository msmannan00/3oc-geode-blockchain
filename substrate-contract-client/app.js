const express = require('express');
const cors = require('cors');
const routes = require('./route');
const app = express();
const PORT = 3002;
const WebSocket = require('ws');
const path = require('path');
const config = require(path.resolve(__dirname, './shared/config'));
const ws = new WebSocket(config.wsProvider);

let server;
ws.on('open', () => {
    console.log(`Connected to ${config.wsProvider}. Starting server...`);
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));
    app.use('/', routes);
    app.use('/controllers', express.static('controllers'));

    server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

ws.on('error', (error) => {
    console.error(`Failed to connect to ${config.wsProvider}:`, error.message);
    console.error('Server will not start.');
});

ws.on('close', () => {
    console.log('WebSocket connection closed. Shutting down the server...');
    if (server) {
        server.close(() => {
            console.log('Server has been closed.');
        });
    }
});
