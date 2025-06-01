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

const allowedOrigins = [
  'http://localhost:3000',
  'https://52-bazaar-frontend.vercel.app',
  'https://52bazaar.eurovisionbdg.com',
  // Include all Vercel preview URLs
  /^https:\/\/52-bazaar-frontend(-[\w]+)?-saddamsagars-projects\.vercel\.app$/,
  /\.vercel\.app$/,
  /\.eurovisionbdg\.com$/
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check each allowed origin pattern
    for (const pattern of allowedOrigins) {
      if (typeof pattern === 'string' && origin === pattern) {
        return callback(null, true);
      }
      if (pattern instanceof RegExp && pattern.test(origin)) {
        return callback(null, true);
      }
    }
    
    console.warn(`CORS blocked for origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
// Handle preflight requests
app.options('*', cors(corsOptions));
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
app.get('/api/test', (req, res) => {

  res.json('Hello');

});
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

// Correctly export for Vercel:
module.exports.app = app;
module.exports.handler = serverless(app);
