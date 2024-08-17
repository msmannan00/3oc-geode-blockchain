const express = require('express');
const cors = require('cors');
const routes = require('./route');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/', routes);
app.use('/controllers', express.static('controllers'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
