const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');

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

// POST /api/logs
router.post('/', authenticate, async (req, res) => {
  try {
    const log = new Log({
      ...req.body,
      userId: req.user.id
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save log:', err.message);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

module.exports = router;
