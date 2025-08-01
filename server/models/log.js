const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🟢 changed from `user` to `userId`
  title: String,
  description: String,
  location: String,
  food: String,
  photoUrl: String,
  rating: Number,
  category: String, // 🟢 add this to support filtering
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Friend'],
    default: 'Public',
  },
  logType: {
    type: String,
    enum: ['Dined', 'To Dine']
    },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
