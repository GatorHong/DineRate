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
  logType: {
    type: String,
    enum: ['Dined', 'To Dine']
    },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
