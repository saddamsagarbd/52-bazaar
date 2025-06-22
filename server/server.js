import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { connA } from './db-config/db-conn.js';

import authRoute from './routes/auth.js';
import categoryRoute from './routes/category.js';
import productRoute from './routes/product.js';

const app = express();

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://localhost:3000',
  'https://52bazaar.eurovisionbdg.com',
  'https://52-bazaar-frontend.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS Blocked Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure MongoDB is connected before handling any route
app.use(async (req, res, next) => {
  try {
    await connA();
    next();
  } catch (err) {
    console.error("DB connection error middleware:", err);
    res.status(500).json({ message: "Database connection error" });
  }
});

// Routes

app.use("/api", authRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);

app.all('*', (req, res) => {
  res.status(404).json({ message: 'API route not found', path: req.path });
});

app.get('/api', (req, res) => {
  res.json('API established');
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

// Correctly export for Vercel:
export { app };
export default app;
