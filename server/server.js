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

// CORS configuration
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

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure MongoDB is connected before handling any route
app.use(async (req, res, next) => {
  try {
    await connA(); // important: await DB connection on every request in Vercel
    next();
  } catch (err) {
    console.error("DB connection error middleware:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Routes
app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.send({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Export app normally (for local dev)
module.exports.app = app;

// Export serverless handler (for Vercel production)
module.exports.handler = serverless(app);
