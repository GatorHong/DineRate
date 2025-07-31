const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const protect = require('../middlewares/auth'); // ✅ import the middleware

// Public routes
router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, (req, res) => {
  res.json(req.user); // Return user profile info
});

module.exports = router;
