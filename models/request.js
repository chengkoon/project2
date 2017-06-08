const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User = require('../models/user');

const RequestSchema = new mongoose.Schema({

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: null },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  helperName: { type: String, default: null },
  food: { type: String, default: null },
  destination: { type: String, default: null },
  tokens: { type: Number, default: null },
  requestCreatedUTC: { type: Number, default: null },
  collectionFrom: { type: String, default: null },
  collectionTo: { type: String, default: null },
  collectionFromUTC: {
    type: Number,
    default: null
    // validate: [collectionStartTimeValidator, 'Please enter a valid collection time range']
  },

  collectionToUTC: {
    type: Number,
    default: null
    // validate: [collectionEndTimeValidator, 'Please enter a valid collection time range']
  },
  deliveryReceipt: { type: Boolean, default: false }

})

function collectionStartTimeValidator(value) {
  return this.requestCreatedUTC <= value;
}
function collectionEndTimeValidator(value) {
  return this.requestCreatedUTC < value;
}
// function deliveryStartTimeValidator(value) {
//   if (value !== null) {
//     return ((value >= this.collectionStartUTC) && (value < this.deliveryEndUTC));
//   }
//   return true;
// }
// function deliveryEndTimeValidator(value) {
//   if (value !== null) {
//     return value <= collectionEndUTC;
//   }
//   return true;
// }

module.exports = mongoose.model('Request', RequestSchema);
