const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: { type: String, required: true },
  food: { type: String, required: true },
  category: { type: String, default: 'To Visit' },
  rating: Number,
  photoUrl: String,
  tag: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
