require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimiter');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());

const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.CLIENT_URL_PRODUCTION,
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'DataSea API is running',
        data: {
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
        },
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;