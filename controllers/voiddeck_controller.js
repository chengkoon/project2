let Request = require('../models/request')

let voiddeckController = {

  // list: (req,res) => {
  //   Request.find({}, (err, requests) => {
  //     if (err) throw err
  //     res.render('voiddeck/index')
  //   })
  // },

  index: (req,res) => {
    res.render('voiddeck/index')
  },

  listRequests: (req,res) => {
    // res.render('voiddeck/requests')
    Request.find({}, (err, requests) => {
      if (err) throw err
      res.render('voiddeck/requests', { requests: requests })
    })
  },

  createRequestPage: (req,res) => {
    res.render('voiddeck/createRequest')
  },

  createRequest: (req,res) => {
    let newRequest = new Request({
      author: req.user,
      foodItem: req.body.foodItem,
      foodShop: req.body.foodShop,
      destination: req.body.destination,
      latestBy: req.body.latestBy
    })
    newRequest.save(function (err, savedEntry) {
      if (err) throw err
      res.redirect('/voiddeck')
    })
  },

  updateOrCommit: (req,res) => {
    console.log("Hi, ", req.user);
    console.log("current session user id is: ", req.user._id);
    console.log("can i get the params? ", req.params);
    Request.find({_id: req.params.id})
    .populate('author')
    .exec(function(err, authorInfo) {
      if (err) throw err

      else {
        // console.log("original author id is ", authorInfo[0].author._id);
        // console.log("current session user id is ", req.user._id);
        console.log(typeof authorInfo[0].author._id);
        console.log(typeof req.user._id);


        if (authorInfo[0].author._id.str === req.user._id.str) {
          console.log("if loop is entered");
          console.log("request id is ",authorInfo[0]._id);
          res.redirect('/voiddeck/requests/'+authorInfo[0]._id+'/edit');
        }
      }
    })
  },

  editPage: (req,res) => {
    console.log(req.params);
    Request.findById(req.params.id, (err, requestItem) => {
      if (err) throw err
      else {
        console.log("we are here: ", requestItem);
        res.render('voiddeck/editRequest', { requestItem: requestItem})
        //fill the form with values from requestItem in the editRequest form
      }
    })
  },

  makeEdit: (req,res) => {
    // console.log("req.params is: ", req.params);
    Request.findOneAndUpdate({
      _id: req.params.id
    }, {
      foodItem: req.body.foodItem,
      foodShop: req.body.foodShop,
      destination: req.body.destination,
      latestBy: req.body.latestBy
    }, (err, requestItem) => {
      if (err) throw err
      res.redirect('/voiddeck/requests/view');
    })
  }



}



module.exports = voiddeckController
