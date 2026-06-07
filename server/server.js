require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `DataSea API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
        );
    });
};

startServer();