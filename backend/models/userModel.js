// models/UserA.js (for dbA)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

module.exports = (conn) => conn.model('User', userSchema);
