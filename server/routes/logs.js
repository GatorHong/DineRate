const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middlewares/auth');
const { getLogsByUserId } = require('../controllers/logController');

// Middleware for inline use
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role || 'member',
    };

    next();
  });
};

// POST /api/logs
router.post('/', authenticate, async (req, res) => {
  try {
    let tags = req.body.tags || [];

    if (req.body.description) {
      const extracted = req.body.description.match(/#\w+/g);
      if (extracted) {
        tags = [...new Set([...tags, ...extracted.map(t => t.toLowerCase())])];
      }
    }

    const log = new Log({
      ...req.body,
      tags,
      user: req.user.id,
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(' Failed to save log:', err.message);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

// GET /api/logs?logType=Dined
router.get('/', authenticate, async (req, res) => {
  try {
    const { logType, tag } = req.query;
    const query = { user: req.user.id };

    if (logType) query.logType = logType;
    if (tag) query.tags = tag;

    const logs = await Log.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(' Failed to fetch logs:', err.message);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// GET /api/logs/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [toDineCount, dinedCount] = await Promise.all([
      Log.countDocuments({ user: userId, logType: 'To Dine' }),
      Log.countDocuments({ user: userId, logType: 'Dined' }),
    ]);

    res.json({ toDine: toDineCount, dined: dinedCount });
  } catch (err) {
    console.error(' Failed to fetch log stats:', err.message);
    res.status(500).json({ message: 'Failed to fetch log stats' });
  }
});

// GET /api/logs/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const log = await Log.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    console.error(' Failed to fetch log:', err.message);
    res.status(500).json({ message: 'Failed to fetch log' });
  }
});

// PUT /api/logs/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedLog = await Log.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, tags: req.body.tags || [] },
      { new: true }
    );

    if (!updatedLog) return res.status(404).json({ message: 'Log not found' });

    res.json(updatedLog);
  } catch (err) {
    console.error(' Failed to update log:', err.message);
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
    console.error(' Failed to delete log:', err.message);
    res.status(500).json({ message: 'Failed to delete log' });
  }
});

// GET /api/logs/user/:id — Admin only
router.get('/user/:id', protect, isAdmin, getLogsByUserId);

module.exports = router;
