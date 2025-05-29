const { createConnection } = require('mongoose');

let cachedConn = null;

const connA = () => {
    if (cachedConn) return cachedConn;

    const conn = createConnection(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedConn = conn;
    return conn;
};

module.exports = { connA };
