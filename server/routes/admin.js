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

// PUT /api/admin/users/:id/role — Promote or Demote user (Admin only)
router.put('/users/:id/role', protect, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    console.log(`🔄 Attempting role update for user ${id} to ${role}`);

    if (!['admin', 'member'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: normalizedRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`✅ Updated user ${updatedUser.username} role to ${updatedUser.role}`);

    res.json({ message: `User role updated to ${updatedUser.role}` });
  } catch (err) {
    console.error('❌ Failed to update user role:', err.message);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

module.exports = router;
