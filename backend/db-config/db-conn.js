const mongoose = require('mongoose');

let cachedConn = null;

const connA = async () => {
    if (cachedConn) return cachedConn;

    try {
        const conn = await mongoose.createConnection(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cachedConn = conn;
        return cachedConn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

module.exports = { connA };
