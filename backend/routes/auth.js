const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
require('dotenv').config();

const createErrorResponse = (message, code) => ({
  error: { message, code }
});

// Initialize admin user on startup
const initializeAdminUser = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminUsername || !adminPassword) {
      console.error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env');
      return;
    }

    const existingUser = await User.findOne({ where: { username: adminUsername } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Admin user created:', adminUsername);
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Run admin user initialization
initializeAdminUser();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json(createErrorResponse('Username and password are required', 'VALIDATION_ERROR'));
    }

    // Check .env credentials for admin
    if (username === process.env.ADMIN_USERNAME) {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json(createErrorResponse('Admin user not found in database', 'UNAUTHORIZED'));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json(createErrorResponse('Invalid username or password', 'UNAUTHORIZED'));
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ message: 'Login successful', token });
    }

    // Handle non-admin users
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json(createErrorResponse('Invalid username or password', 'UNAUTHORIZED'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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

module.exports = router;
