const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  location: String,
  food: String,
  photoUrl: String,
  rating: Number,
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Friend'],
    default: 'Public'
  },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
