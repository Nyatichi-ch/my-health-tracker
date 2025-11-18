const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  water: { type: Number, required: true },
  exercise: { type: Number, required: true },
  sugar: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema);
