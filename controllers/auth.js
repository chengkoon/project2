var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Todo = require('../models/todo');
var passport = require('../config/ppConfig'); 

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }, function(err, createdUser) {
    if(err){
      // FLASH
      req.flash('error', 'Could not create user account');
      res.redirect('/auth/signup');
    } else {
      // FLASH
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    }
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

// FLASH
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));

router.post('/signup', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      console.log('An error occurred: ' + err);
      res.redirect('/auth/signup');
    }
    if (!user) {
      User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      }, function(err, createdUser) {
        if(err){
          console.log('Could not create user', err);
          res.redirect('/auth/signup');
        } else {
          // Authenticate with passport
          passport.authenticate('local', {
            successRedirect: '/',
            successFlash: 'Account created and logged in'
          })(req, res);
        }
      });
    } else {
      console.log('Email already exists');
      res.redirect('/auth/login');
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  // FLASH
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
