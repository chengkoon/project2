let User = require('../models/user');
let passport = require('../config/ppConfig');

let homepageController = {
  
  index: (req,res) => {
    res.render('index');
  },

  registrationPage: (req,res) => {
    res.render('homepage/register');
  },

  register: (req,res) => {
    User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }, function(err, createdUser) {
      if(err){
        // FLASH
        req.flash('error', 'Could not create user account');
        res.redirect('/register');
      } else {
        // can add extra conditions here
        // FLASH
        passport.authenticate('local', {
          successRedirect: '/',
          successFlash: 'Account created and logged in'
        })(req, res);
      }
    });
  },

  loginPage: (req,res) => {
    res.render('homepage/login');
  },

  login:
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'Invalid username and/or password',
      successFlash: 'You have logged in'
    }),

  logout: (req, res) => {
    req.logout();
    // FLASH
    req.flash('success', 'You have logged out');
    res.redirect('/');
  }
}

module.exports = homepageController
