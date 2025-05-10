import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.create({ 
      name, 
      email, 
      password,
      provider: 'local' 
    });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user && !user.provider) {
      user.provider = 'local';
      await user.save();
    }
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider || 'local'
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: '1d'
      }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};