require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const { connA } = require('./db-config/db-conn');

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

const app = express();

// CORS configuration (blocking Vercel)
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin.includes('vercel.app')) {
            return callback(new Error('Vercel domains are not allowed by CORS'));
        }
        const allowedOrigins = [
            'https://52bazaar.eurovisionbdg.com',
            'http://localhost:3000'
        ];
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

// Health check route
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

// Start server (Render always uses PORT from env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connA();
});