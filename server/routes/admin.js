// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Log = require('../models/log');
const { protect, isAdmin } = require('../middlewares/auth');

// GET all users (Admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET all logs (Admin only)
router.get('/logs', protect, isAdmin, async (req, res) => {
  try {
    const logs = await Log.find().populate('user', 'username name');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

module.exports = router;
