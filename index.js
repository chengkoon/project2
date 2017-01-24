require('dotenv').config({ silent: true });
const express = require('express');

const path = require('path');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/ppConfig');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const todo = require('./routes/todo_router');
const allRoutes = require('./routes/allRoutes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const isLoggedIn = require('./middleware/isLoggedIn');
const Todo = require('./models/todo');
var app = express();

mongoose.connect('mongodb://localhost/myapp3');
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('dev'));
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/', allRoutes);
app.use('/auth', require('./controllers/auth'));

// app.get('/', function(req, res) {
//   res.render('index');
// });
//
// app.get('/profile', isLoggedIn, function (req, res) {
//   Todo.find({author: req.user._id}, function (err, todos) {
//     if (err) res.status(404).json({msg: 'cannot find any todos'})
//     else {
//       console.log("todos are ", todos);
//       // res.render('profile', {something:todos});
//       res.render('profile',{name:req.user.name, id:req.user._id, something:todos})
//     }
//   })
// })
//
// app.get('/new', isLoggedIn, function(req, res){
//   res.render('new');
// });
//
// app.post('/new', function (req, res) {
//
//   Todo.create({
//     author:req.user._id,
//     name:req.body.name,
//     description: req.body.description,
//     completed: req.body.completed
//   }, function (err, todo) {
//     if (err) res.status(422).json({msg: 'Could not ceate todo because:' + err})
//     else {
//       console.log(req.user._id);
//       res.status(201).redirect('/profile')
//     }
//   })
// })


// app.listen(3000)
app.listen(process.env.PORT || 3000)
