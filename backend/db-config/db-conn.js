
const mongoose = require('mongoose');

const connA = mongoose.createConnection(process.env.MONGO_URI);


module.exports = { connA }