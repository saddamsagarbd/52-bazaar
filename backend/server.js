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

// Enhanced CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server)
        if (!origin) return callback(null, true);
        
        // List of allowed domains and patterns
        const allowed = [
            'https://52bazaar.eurovisionbdg.com',
            /^https:\/\/52-bazaar-frontend(-[a-z0-9]+)?-saddamsagars-projects\.vercel\.app$/,
            /^http:\/\/localhost(:\d+)?$/,
            /\.vercel\.app$/
        ];

        // Check if origin matches any allowed pattern
        if (allowed.some(pattern => 
            typeof pattern === 'string' 
                ? origin === pattern 
                : pattern.test(origin))
        ) {
            return callback(null, true);
        }

        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from API' });
});

app.get('/api/health', (req, res) => {
    res.send({ status: 'OK' });
});

// For local dev only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        connA();
        // const conn = await connA();
        // conn.once('open', async () => {
        //     console.log('MongoDB connected.');
        //     const result = await conn.db.admin().ping();
        //     console.log('Ping response:', result);
        // });
    });
}

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Always export for serverless (Vercel)
module.exports = serverless(app);
