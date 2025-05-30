const { createConnection, default: mongoose } = require('mongoose');

let cachedConn = null;

const connectDB = () => {
    if (cachedConn) return cachedConn;

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        enableUtf8Validation: false,
    });

    // const conn = createConnection(process.env.MONGO_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });

    // cachedConn = conn;
    // return conn;
};

module.exports = { connectDB };
