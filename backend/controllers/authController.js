const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { connA } = require('../db-config/db-conn');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function getUserModel() {
  const conn = await connA();
  return UserModel(conn);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const User = await getUserModel();
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};