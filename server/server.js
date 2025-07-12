const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant'); // 👈 Added

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes); // 👈 Added

// Health check route
app.get("/", (req, res) => {
  res.send("✅ DineRate backend is running.");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
