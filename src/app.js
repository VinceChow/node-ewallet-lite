const express = require('express');
require('../db/mongoose');
// Routes
const userRoute = require('../routes/user');
const merchantRoute = require('../routes/merchant');
const reloadRoute = require('../routes/reload');
const transactionRoute = require('../routes/transaction');
const transferRoute = require('../routes/transfer');

const app = express();

// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/users', userRoute);
app.use('/api/merchants', merchantRoute);
app.use('/api/reload', reloadRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/transfer', transferRoute);

module.exports = app;
