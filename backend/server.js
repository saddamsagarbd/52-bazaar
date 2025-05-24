// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { connA } = require('./db-config/db-conn');
const app = express();
const serverless = require('serverless-http');
const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

// Enable CORS for all routes

const allowedOrigins = [
  'http://localhost:3000',          // Local development
  'https://52-bazaar-frontend-saddamsagars-projects.vercel.app/',   // Production frontend
  'https://52bazaar.eurovisionbdg.com' // Custom domain
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from API' });
});

app.get('/api/health', (req, res) => {
    res.send({ status: 'OK' });
});

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
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

// Always export the app for serverless
module.exports = serverless(app);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);

        connA.once('open', async () => {
            console.log('Custom connection established.');
            const result = await connA.db.admin().ping();
            console.log('Ping response:', result);
        });
    });
}
