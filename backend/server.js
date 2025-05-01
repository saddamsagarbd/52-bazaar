// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoute = require('./routes/auth');
const cors = require('cors');

const { connA } = require('./db-config/db-conn');


// Enable CORS for all routes
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

    connA.once('open', async () => {
        console.log('Custom connection established.');
      
        const result = await connA.db.admin().ping();
        console.log('Ping response:', result);
    });
});
