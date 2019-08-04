const express = require('express');
require('../db/mongoose');
// Routes
const userRoute = require('../routes/user');
const merchantRoute = require('../routes/merchant');
const reloadRoute = require('../routes/reload');

const app = express();

// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/users', userRoute);
app.use('/api/merchants', merchantRoute);
app.use('/api/reload', reloadRoute);

app.get('/', (req, res) => {
    console.log('success');
    res.send('success');
});

module.exports = app;
