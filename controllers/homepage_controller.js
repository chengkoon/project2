const User = require('../models/user');
const passport = require('../config/ppConfig');
const Request = require('../models/request')

const homepageController = {

  index: (req,res) => {
    res.render('homepage/index');
    // Request.find({}, (err, requests) => {
    //   if (err) throw err
    //   res.render('index', { requests: requests })
    // })
  },

  registrationPage: (req,res) => {
    res.render('homepage/register');
  },

  register: (req,res) => {
    console.log('CLIENT: received', req.body);
    User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      tokens: 3
    }, function(err, createdUser) {
      if(err){
        // FLASH
        req.flash('error', 'Could not create user account');
        res.redirect('/register');
      } else {
        // can add extra conditions here
        // FLASH
        passport.authenticate('local', {
          successRedirect: '/voiddeck/requests/view',
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
      successRedirect: '/voiddeck/requests/view',
      failureRedirect: '/login',
      failureFlash: 'Invalid username and/or password',
      successFlash: 'You are logged in'
    }),

  logout: (req, res) => {
    req.logout();
    // FLASH
    req.flash('success', 'You have logged out');
    res.redirect('/');
  }
}

module.exports = homepageController
