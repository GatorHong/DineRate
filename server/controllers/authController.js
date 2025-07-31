const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // ✅ Validate input fields
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.create({ name, username, password });
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", { username, password });

    if (!username || !password) {
      console.log("⛔ Missing fields");
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log("✅ Login successful");

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        photo: user.photo,
      },
    });

  } catch (err) {
    console.error("🔥 Login Error:", err.message);
    console.error(err.stack);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
