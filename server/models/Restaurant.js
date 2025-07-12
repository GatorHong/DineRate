// server/models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  rating: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
