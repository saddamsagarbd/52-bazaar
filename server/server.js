require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const serverless = require('serverless-http');

const { connA } = require('./db-config/db-conn');

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const userRoutes = require("./routes/userRoutes");

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://52-bazaar-frontend.vercel.app',
  'https://52bazaar.eurovisionbdg.com',
  /\.vercel\.app$/,
  /\.eurovisionbdg\.com$/
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);
app.use("/api/users", userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Correctly export for Vercel:
module.exports = {
  app,
  handler: serverless(app)
};
