require('dotenv').config();
const express       = require('express');
const path          = require('path');
const cors          = require('cors');
const serverless    = require('serverless-http');
const { connA }     = require('./db-config/db-conn');

const app = express();

const allowedOrigins = [
  'https://localhost:3000',
  'https://52bazaar.eurovisionbdg.com',
  'https://52-bazaar-frontend.vercel.app', // keep this if you still use it
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure MongoDB is connected before handling any route
app.use(async (req, res, next) => {
  try {
    console.log("Trying to connect to DB...");
    await connA();
    console.log("Connected to DB successfully");
    next();
  } catch (err) {
    console.error("DB connection error middleware:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Routes

app.all('*', (req, res) => {
  res.status(404).json({ message: 'API route not found', path: req.path });
});


app.get('/api', (req, res) => {
  res.json('API established');
});

const authRoute     = require("./routes/auth.js");
const categoryRoute = require("./routes/category.js");
const productRoute  = require("./routes/product.js");
// const userRoutes    = require("./routes/userRoutes.js");

app.use("/api", authRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
// app.use("/api", userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

console.log("Registered Routes:", app._router.stack.map(layer => layer.route?.path).filter(Boolean));

// Correctly export for Vercel:
module.exports = app;
