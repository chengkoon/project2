const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User = require('../models/user');

const RequestSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  foodItem: String,
  foodShop: String,
  destination: String,
  latestBy: String
})


module.exports = mongoose.model('Request', RequestSchema);
