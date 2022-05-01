const express = require('express');
const app = express();
const cors = require('cors');
const api = require('./routes/api');

app.use(cors());
app.use(express.json());
app.use('/', api);

module.exports = app;