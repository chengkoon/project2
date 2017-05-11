const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User = require('../models/user');

const RequestSchema = new mongoose.Schema({

  author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],


  destination: String,
  requestCreatedUTC: { type: Number, default: null },
  collectionStartDate: { type: String, default: null },
  collectionEndDate: { type: String, default: null },
  // collectionStartTime: { type: String, default: null }, // change to StartHour and StartMin
  // collectionEndTime: { type: String, default: null }, // change to EndHour and EndMin
  collectionStartHour: { type: String, default: null },
  collectionStartMin: { type: String, default: null },
  collectionEndHour: { type: String, default: null },
  collectionEndMin: { type: String, default: null },

  //consolidated collection date+time start and end in UTC format:
  collectionStartUTC: {
    type: Number,
    default: null,
    validate: [collectionStartTimeValidator, 'Please enter a valid collection time range']
  },

  collectionEndUTC: {
    type: Number,
    default: null,
    validate: [collectionEndTimeValidator, 'Please enter a valid collection time range']
  },

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

function collectionStartTimeValidator(value) {
  return this.requestCreatedUTC <= value;
}
function collectionEndTimeValidator(value) {
  return this.requestCreatedUTC < value;
}

module.exports = mongoose.model('Request', RequestSchema);
