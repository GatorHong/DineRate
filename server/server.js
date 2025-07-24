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
const restaurantRoutes = require('./routes/restaurant');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ DineRate backend is running.");
});

// MongoDB connection using secure environment variables
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const CLUSTER_URL = process.env.CLUSTER_URL;
const DB_NAME = process.env.DB_NAME;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${CLUSTER_URL}/${DB_NAME}?retryWrites=true&w=majority&appName=DineRateCluster`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
