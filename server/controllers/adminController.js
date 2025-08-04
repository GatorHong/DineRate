const User = require('../models/User');

// PUT /admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User role updated', user: updated });
  } catch (err) {
    console.error('❌ updateUserRole error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
