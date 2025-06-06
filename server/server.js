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

// app.use(cors(corsOptions));
// Handle preflight requests
// app.options('*', cors(corsOptions));
app.use(express.json());

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

app.get('/api', (req, res) => {
  res.json('API established');
});

const authRoute     = require("./routes/auth.js");
const categoryRoute = require("./routes/category.js");
const productRoute  = require("./routes/product.js");
const userRoutes    = require("./routes/userRoutes.js");

app.use(authRoute);
app.use(categoryRoute);
app.use(productRoute);
app.use(userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

console.log("Registered Routes:", app._router.stack.map(layer => layer.route?.path).filter(Boolean));

// Correctly export for Vercel:
module.exports = app;
