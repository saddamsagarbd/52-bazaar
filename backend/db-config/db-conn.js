const mongoose = require('mongoose');

let isConnected;

const connA = async () => {
    if (isConnected) {
        return mongoose;
    }

    const db = await mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
    });

    isConnected = db.connections[0].readyState;
    return db;
};

module.exports = { connA };
