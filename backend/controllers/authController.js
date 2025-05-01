const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { connA } = require('../db-config/db-conn');
const UserModel = require('../models/userModel');
const User = UserModel(connA);

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Controller to get a list of all barcodes
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
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
      res.status(500).send('Server error');
    }
};