// server/models/Restaurant.js
const mongoose = require('mongoose');

// models/Restaurant.js
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  rating: { type: Number, default: 0 },
  photo_url: String,                
  place_id: String,                 
});


module.exports = mongoose.model('Restaurant', restaurantSchema);
