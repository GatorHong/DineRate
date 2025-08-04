const Log = require('../models/log');

// GET logs by any user ID (admin only)
exports.getLogsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only admins can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const [toDine, dined] = await Promise.all([
      Log.find({ user: id, logType: 'To Dine' }).sort({ createdAt: -1 }),
      Log.find({ user: id, logType: 'Dined' }).sort({ createdAt: -1 }),
    ]);

    res.json({ toDine, dined });
  } catch (err) {
    console.error('❌ Failed to get logs for user:', err.message);
    res.status(500).json({ message: 'Failed to fetch user logs' });
  }
};
