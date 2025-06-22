import jwt    from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User   from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const login = async (req, res) => {
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
      res.status(500).json({ message: 'Server error' });
    }
};

export default { login }