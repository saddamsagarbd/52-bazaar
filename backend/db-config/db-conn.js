const { createConnection, default: mongoose } = require('mongoose');

let cachedConn = null;

const connA = async () => {
    if (cachedConn) return cachedConn;

    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI);

        cachedConn = conn;
        console.log("MongoDB connected");
        return conn;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

module.exports = { connA };
