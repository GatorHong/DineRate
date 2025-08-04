// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, isAdmin } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);

// Example: Get profile
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

// Example: Admin-only route
router.get('/admin-only', protect, isAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

module.exports = router;
