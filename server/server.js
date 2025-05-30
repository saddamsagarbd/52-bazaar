require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const serverless = require('serverless-http');

const { connA } = require('./db-config/db-conn');

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

const app = express();

// CORS configuration for Vercel + production domain
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://52bazaar.eurovisionbdg.com',
      'https://52-bazaar-frontend-saddamsagars-projects.vercel.app',
      'http://localhost:3000'
    ];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    res.send({ status: 'OK' });
  } catch (err) {
    res.status(500).send({ status: 'ERROR', error: err.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Only connect DB once on cold start (in Vercel)
connA();

module.exports = app;
module.exports.handler = serverless(app);
