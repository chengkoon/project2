// var mongoose = require('mongoose');
//
// // Schema
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// var UserSchema = new Schema({
//   name: String,
//   user_id: //gonna be an object...
// });
//
// var CommentSchema = new Schema({
//   text: String,
//   created_by: { type: Schema.Types.ObjectId, ref: 'User' }
// });
//
// var ItemSchema = new Schema({
//    comments: [CommentSchema]
// });
//
// // Connect to DB and instantiate models
// var db = mongoose.connect('mongodb://localhost/testapp');
// var User = db.model('User', UserSchema);
// var Comment = db.model('Comment', CommentSchema);
// var Item = db.model('Item', ItemSchema);
//
// // create first
// User.create({name:'chengkoon'})
// console.log("user created");
//
//
//
// Find and populate
// Item.find({}).populate('comments.created_by').exec(function(err, items) {
//     console.log(items[0].comments[0].created_by.name);
// });
