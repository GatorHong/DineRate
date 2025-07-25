const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  food: String,
  category: { type: String, default: 'To Visit' },
  rating: Number,
  tag: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
