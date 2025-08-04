const User = require('../models/User');

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'member'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role: role.charAt(0).toUpperCase() + role.slice(1) }, // Normalize to 'Admin'/'Member'
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User role updated to ${updated.role}` });
  } catch (err) {
    console.error('❌ Failed to update user role:', err.message);
    res.status(500).json({ message: 'Failed to update role' });
  }
};
