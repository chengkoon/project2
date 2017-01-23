var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
var User = require('../models/user');

const TodoSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  helper: {},
  name: String,
  description: String,
  completed: { type: Boolean, default: false}
})
//you definitely need to create another schema for the helper - but you shldn't include strings in it but
//just referencing - so it becomes just a mirror of the original task schema instance!

module.exports = mongoose.model('Todo', TodoSchema);
