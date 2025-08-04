const Log = require('../models/log');

// GET logs by any user ID (admin only)
exports.getLogsByUserId = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const allLogs = await Log.find({ user: req.params.id });

    // Case-insensitive filtering
    const toDine = allLogs.filter(log => log.logType?.toLowerCase() === 'to dine');
    const dined = allLogs.filter(log => log.logType?.toLowerCase() === 'dined');

    res.json({ toDine, dined });
  } catch (err) {
    console.error('❌ Failed to get logs for user:', err.message);
    res.status(500).json({ message: 'Failed to fetch user logs' });
  }
};

