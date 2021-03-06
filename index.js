require('dotenv').config({ silent: true });
const express = require('express');
const path = require('path');
// const moment = require('moment');
// moment().format();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const allRoutes = require('./routes/allRoutes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const isLoggedIn = require('./middleware/isLoggedIn');

const Request = require('./models/request');

const app = express();

// connect to MongoDB based on environment
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/myapp3-test')
  console.log('CONNECTING TO TEST SERVER...');
} else {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myapp3'); //heroku
}
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

// app.listen(3000)
app.listen(process.env.PORT || 3000)

// let tests use this file
