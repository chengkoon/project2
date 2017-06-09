const Request = require('../models/request')
const User = require('../models/user')
const moment = require('moment');
const express = require('express');
const app = express();
const isLoggedIn = require('../middleware/isLoggedIn');

moment().format();

const millisecondConverter = function(date,hour,min) {
  let dateMS = date.split('-');
  // let timeMS = time.split(':');
  hour = parseInt(hour);
  min = parseInt(min);
  let finalMS = new Date(dateMS[0],dateMS[1]-1,dateMS[2],hour,min);
  return finalMS.getTime();
}

const dateNow = Date.now();

const voiddeckController = {

  listRequests: (req,res) => {

    Request.find({
      helper: { $eq: null },
      collectionToUTC: { $gt: dateNow }
    }, (err, requests) => {
      if (err) throw err
      else {
        // sessionStorage.setItem('mySelectValue', 0);
        res.render('voiddeck/requests', { requests: requests, currentUser: req.user, currentTab: "allRequests" });
      }
    })
  },

  userRequests: (req,res) => {
    User.findOne({ _id: req.user._id })
    .populate('requestsAccepted')
    .populate('requestsMade')
    .exec()
    .then(function(user) {
      var result = {
        activeAcceptedRequests: [],
        expiredAcceptedRequests: [],
        activeRequestsMade: [],
        expiredRequestsMade: []
      };
      user.requestsAccepted.forEach(function(requestAccepted) {
        if (requestAccepted.collectionToUTC > dateNow) result.activeAcceptedRequests.push(requestAccepted);
        else result.expiredAcceptedRequests.push(requestAccepted);
      });
      user.requestsMade.forEach(function(requestMade) {
        if (requestMade.collectionToUTC > dateNow) result.activeRequestsMade.push(requestMade);
        else result.expiredRequestsMade.push(requestMade);
      });
      console.log("inside then...", result);
      res.render('voiddeck/userRequests', { result })
    })
    .catch(function(err) {
      console.log('error is: ', err);
    })
  },

  createRequestPage: (req,res) => {
    if (req.user.party) { //meaning user is alr in a party
      req.flash('error', 'You are already in a party! Leave/delete your party before creating a new one');
      res.redirect('/voiddeck');
    }
    res.render('voiddeck/createRequest', { currentTab: "createRequest" });
  },

  createRequest: (req,res) => {

    let dateNowUTC = Date.now();
    var collectionFromUTC = moment(req.body.collectionFrom, 'ddd DD/MM/YYYY h:mm A').valueOf();
    var collectionToUTC = moment(req.body.collectionTo, 'ddd DD/MM/YYYY h:mm A').valueOf();

    let newRequest = new Request({

      author: req.user._id,
      authorName: req.user.name,
      food: req.body.food,
      destination: req.body.destination,
      tokens: req.body.rewards,
      requestCreatedUTC: dateNowUTC,
      collectionFrom: req.body.collectionFrom,
      collectionTo: req.body.collectionTo,
      collectionFromUTC: collectionFromUTC,
      collectionToUTC: collectionToUTC
    })

    newRequest.save(function (err, savedEntry) {
      if (err) {
        req.flash('error', 'Please enter a valid time range for collection time.');
        res.redirect('/voiddeck/requests/create');
      }
      else {
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          // foodItem: req.body.foodItem,
          // party: newRequest._id
          tokens: req.user.tokens - req.body.rewards,
          $push: { requestsMade: savedEntry._id }
        }, (err, thing) => {
          if (err) throw err
          else {
            res.redirect('/voiddeck/requests/view');
          }
        })
      }
    })
  },

  editPage: (req,res) => {
    Request.findById(req.params.id, (err, request) => {
      if (err) throw err
      // else if request.author is not req.user._id then redirect to another page with flash msg
      else {
        res.render('voiddeck/editRequest', { request: request, tokens: req.user.tokens + request.tokens })
      }
    })
  },

  makeEdit: (req,res) => {

    var collectionFromUTC = moment(req.body.collectionFrom, 'ddd DD/MM/YYYY h:mm A').valueOf();
    var collectionToUTC = moment(req.body.collectionTo, 'ddd DD/MM/YYYY h:mm A').valueOf();
    let dateNowUTC = Date.now();
    let changedRewards = parseInt(req.body.rewards);

    Request.findOne({
      _id: req.params.id
    }, (err, thisRequest) => {
      if (err) throw err

      else if (thisRequest.helper) {
        req.flash("error", "Failed to edit request as someone has accepted to fulfill your request.");
        res.redirect('/voiddeck/requests/view');
      }

      else {

        if (thisRequest.tokens !== changedRewards) {
          console.log("thisRequest.tokens and changedRewards are...", thisRequest.tokens, changedRewards)
          console.log("typeof thisRequest.tokens and changedRewards are...", typeof thisRequest.tokens, typeof changedRewards)

          User.findOneAndUpdate({
            _id: req.user.id
          }, {
            tokens: req.user.tokens + thisRequest.tokens - changedRewards
          }, (err, editedUser) => {
            if (err) throw err;
            else {
              Request.findOneAndUpdate({
                _id: req.params.id
              }, {

                food: req.body.food,
                destination: req.body.destination,
                tokens: changedRewards,
                requestCreatedUTC: dateNowUTC,
                collectionFrom: req.body.collectionFrom,
                collectionTo: req.body.collectionTo,
                collectionFromUTC: collectionFromUTC,
                collectionToUTC: collectionToUTC

              }, (err, editedRequest) => {
                if (err) {
                  req.flash("error", "Unable to edit request, please try again");
                  res.redirect("/voiddeck/requests/view");
                }
                else {
                  req.flash("success", "Your request has been successfully edited")
                  res.redirect('/voiddeck/requests/view');
                }
              })
            }
          })
        }
      }
    })
  },

  helpDeliver: (req,res) => {

    Request.findOneAndUpdate({
      _id: req.params.id
    }, {
      helper: req.user._id,
      helperName: req.user.name
    }, (err, requestToBeAccepted) => {
      if (err) throw err
      else {
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $push: { requestsAccepted: requestToBeAccepted._id }
        }, (err, user) => {
          res.redirect('/voiddeck/requests/user');
        })
      }
    })
  },

  deliveryReceived: (req, res) => {
    Request.findOneAndUpdate({
      _id: req.params.id
    }, {
      deliveryReceipt: true
    })
    .exec()
    .then(function(request) {
      return User.findOneAndUpdate({
        _id: req.user._id
      }, {
        $pull: { requestsMade: request._id }
      }).exec();
    })
    .then(function(user) {
      res.redirect('/voiddeck/requests/user');
    })
  },

  transferTokens: (req,res) => {

    Request.findOne({ _id: req.params.id })
    .populate('helper')
    .exec()
    .then(function(request) {
      if (request.author.equals(req.user._id)) { // request creator clicked 'delete' button
        return User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $inc: { tokens: request.tokens}
        }).exec();
      }
      else if (request.helper.equals(req.user._id)) { // else if instead of else for clarity's sake
        return User.findOneAndUpdate({
          _id: request.helper
        }, {
          $inc: { tokens: request.tokens }
        }).exec();
      }
    })
    .then(function(user) {
      voiddeckController.delete(req, res);
    })
  },
  delete: (req,res) => {
    Request.findOneAndRemove({ _id: req.params.id }, function(err, request) {
      if (err) throw err;
      else {
        res.redirect('/voiddeck/requests/user');
      }
    });
  }
} // end of voiddeck controller object
module.exports = voiddeckController
