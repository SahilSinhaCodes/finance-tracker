import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is missing in register route!');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const { name, email, password } = req.body;

  try {
    console.log('Register request:', { name, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    console.log('User created:', newUser);

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name, email },
    });
  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is missing in login route!');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

export default router;
