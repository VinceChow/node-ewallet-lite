const express = require('express');
require('../db/mongoose');
// Routes
const userRoute = require('../routes/user');

const app = express();

// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    console.log('success');
    res.send('success');
});

module.exports = app;
