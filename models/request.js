const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User = require('../models/user');

const RequestSchema = new mongoose.Schema({

  author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  foodShop: String,
  destination: String,

  collectionStartDate: { type: String, default: null },
  collectionEndDate: { type: String, default: null },
  collectionStartTime: { type: String, default: null },
  collectionEndTime: { type: String, default: null },
  //consolidated collection date+time start and end in UTC format:
  collectionStartUTC: { type: Number, default: null },
  collectionEndUTC: { type: Number, default: null },

  deliveryStartDate: { type: String, default: null },
  deliveryEndDate: { type: String, default: null },
  deliveryStartTime: { type: String, default: null },
  deliveryEndTime: { type: String, default: null },
  //consolidated delivery date+time start and end in UTC format:
  deliveryStartUTC: { type: Number, default: null },
  deliveryEndUTC: { type: Number, default: null },

  members: [],
  helper: [],
  food: [],
  numberOfConfirmedDelivery: { type: Number, default: 0 }

})


module.exports = mongoose.model('Request', RequestSchema);
