const express = require('express');
const router = express.Router();
const Log = require('../models/log'); // ✅ lowercase!
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
      user: req.user.id // ✅ this must match the schema
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Failed to save log:', err.message);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

// GET /api/logs?logType=Dined
router.get('/', authenticate, async (req, res) => {
  try {
    const { logType } = req.query;
    const query = { user: req.user.id };
    if (logType) {
      query.logType = logType;
    }
    const logs = await Log.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err.message);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// GET /api/logs/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const log = await Log.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    console.error('❌ Failed to fetch log:', err.message);
    res.status(500).json({ message: 'Failed to fetch log' });
  }
});

// PUT /api/logs/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedLog = await Log.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Only allow updating own log
      req.body,
      { new: true } // Return updated document
    );

    if (!updatedLog) return res.status(404).json({ message: 'Log not found' });

    res.json(updatedLog);
  } catch (err) {
    console.error('❌ Failed to update log:', err.message);
    res.status(500).json({ message: 'Failed to update log' });
  }
});

// DELETE /api/logs/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found or unauthorized' });
    }

    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete log:', err.message);
    res.status(500).json({ message: 'Failed to delete log' });
  }
});


module.exports = router;
