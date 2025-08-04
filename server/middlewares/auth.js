const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // ✅ Normalize role to lowercase ('Admin' → 'admin') for consistent comparison
    req.user = {
      ...user.toObject(),
      role: user.role?.toLowerCase(),
    };

    console.log('🛡️ Authenticated:', req.user.username, '| role:', req.user.role);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check for Admin role
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Middleware to check for Member role
const isMember = (req, res, next) => {
  if (!req.user || req.user.role !== 'member') {
    return res.status(403).json({ message: 'Access denied: Members only' });
  }
  next();
};

module.exports = {
  protect,
  isAdmin,
  isMember,
};
