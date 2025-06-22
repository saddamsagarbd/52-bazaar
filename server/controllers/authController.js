import jwt    from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User   from '../models/userModel.js';

const setCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {

      setCors(req, res);

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid email or password' });

      try {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '1d' }
        );
        res.json({ token, user: { id: user._id, email: user.email } });
      } catch (tokenErr) {
        console.error("JWT Error:", tokenErr.message);
        res.status(500).json({ message: "Token generation failed" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

export default { login }