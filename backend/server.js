// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const authRoute = require('./routes/auth');
const catRoute = require('./routes/category');
const productRoute = require('./routes/product');
const cors = require('cors');

const { connA } = require('./db-config/db-conn');


// Enable CORS for all routes
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://eurovisionbdg.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use('/', (req, res) => res.send('API stablished'));
app.use('/api', authRoute);
app.use('/api', catRoute);
app.use('/api', productRoute);

app.get('/api/health', (req, res) => {
    res.send({ status: 'OK' });
});

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

  

const PORT = process.env.PORT || 5000;


connA.on('error', err => {
    console.error('MongoDB connection error:', err);
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

if (process.env.NODE_ENV === 'production') {
    module.exports = app;
}else{
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)

        connA.once('open', async () => {
            console.log('Custom connection established.');
        
            const result = await connA.db.admin().ping();
            console.log('Ping response:', result);
        });
    });
}


  
