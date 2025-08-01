const express = require('express');
const router = express.Router();
const Log = require('../models/log'); // ✅ lowercase!
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// POST /api/logs → Create a log
router.post('/', authenticate, async (req, res) => {
  try {
    const log = new Log({
      ...req.body,
      user: req.user.id, // ✅ set user from token
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save log:', err.message);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

// ✅ GET /api/logs → Get logs for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const category = req.query.category;
    const filter = { userId: req.user.id };

    if (category) {
      filter.category = category;
    }

    // 🔍 Add these logs for debugging
    console.log('🔑 Decoded user ID:', req.user.id);
    console.log('📦 Received category:', category);
    console.log('🧪 Final filter used:', filter);

    const logs = await Log.find(filter).sort({ createdAt: -1 });
    console.log('✅ Logs found:', logs.length);

    res.json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err.message);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});


module.exports = router;
