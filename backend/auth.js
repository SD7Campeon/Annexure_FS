// C:\Users\hp\Downloads\annexure\backend\routes\auth.js
//Add a register endpoint to handle user registration.
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');

const createErrorResponse = (message, code) => ({
  error: { message, code }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    if (!username || !password) {
      return res.status(400).json(createErrorResponse('Username and password are required', 'VALIDATION_ERROR'));
    }

    const user = await User.findOne({ where: { username } });
    console.log('User found:', user ? { id: user.id, username: user.username, role: user.role, password: user.password } : 'none');
    if (!user) {
      return res.status(401).json(createErrorResponse('Invalid username or password', 'UNAUTHORIZED'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid, 'Plain:', password, 'Hashed:', user.password);
    if (!isPasswordValid) {
      return res.status(401).json(createErrorResponse('Invalid username or password', 'UNAUTHORIZED'));
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse('Internal server error', 'SERVER_ERROR'));
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Registration attempt:', { username, password });
    if (!username || !password) {
      return res.status(400).json(createErrorResponse('Username and password are required', 'VALIDATION_ERROR'));
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json(createErrorResponse('Username already exists', 'DUPLICATE_USER'));
    }

    // Hash password and create user with role 'user'
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: 'user',
    });
    console.log('User registered:', { id: newUser.id, username: newUser.username, role: newUser.role });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(createErrorResponse('Internal server error', 'SERVER_ERROR'));
  }
});

module.exports = router;