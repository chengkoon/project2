let Request = require('../models/request')
let User = require('../models/user')

var millisecondConverter = function(date,hour,min) {
  let dateMS = date.split('-');
  // let timeMS = time.split(':');
  hour = parseInt(hour);
  min = parseInt(min);
  let finalMS = new Date(dateMS[0],dateMS[1]-1,dateMS[2],hour,min);
  return finalMS.getTime();
}

let voiddeckController = {

  index: (req,res) => {
    res.render('voiddeck/index')
  },

  listRequests: (req,res) => {

    Request.find({}, (err, requests) => {
      if (err) throw err
      else {
        res.render('voiddeck/requests', { requests: requests, currentUser: req.user })
      }
    })
  },

  createRequestPage: (req,res) => {
    if (req.user.party) { //meaning user is alr in a party
      req.flash('error', 'You are already in a party! Leave/delete your party before creating a new one');
      res.redirect('/voiddeck');
    }
    res.render('voiddeck/createRequest')
  },

  createRequest: (req,res) => {
    console.log("HELLO we just posted createRequest");
    if (req.user.party) { //meaning user is alr in a party
      req.flash('error', 'You are already in a party! (Leave/delete your party before helping others)');
      res.redirect('/voiddeck');
    }

    // let collectionStartUTC = millisecondConverter(req.body.collectionStartDate, req.body.collectionStartHour, req.body.collectionStartMin);
    // let collectionEndUTC = millisecondConverter(req.body.collectionEndDate, req.body.collectionEndHour, req.body.collectionEndMin);
    let dateNowUTC = Date.now();

    let newRequest = new Request({

      author: req.user._id,
      food: req.body.foodItem,
      destination: req.body.destination,
      requestCreatedUTC: dateNowUTC,

      // collectionStartDate: req.body.collectionStartDate,
      // collectionEndDate: req.body.collectionEndDate,
      // collectionStartHour: req.body.collectionStartHour,
      // collectionStartMin: req.body.collectionStartMin,
      // collectionEndHour: req.body.collectionEndHour,
      // collectionEndMin: req.body.collectionEndMin,
      collectionStartUTC: req.body.collectionFrom,
      collectionEndUTC: req.body.collectionTo
    })

    console.log("c.start, end, and dateNowUTC are...", req.body.collectionStartUTC, req.body.collectionEndUTC, dateNowUTC);
    console.log("destination is...", req.body.destination);

    newRequest.save(function (err, savedEntry) {
      if (err) {

        req.flash('error', 'Please enter a valid time range for collection time.');
        res.redirect('/voiddeck');
      }


      else {
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          foodItem: req.body.foodItem,
          party: newRequest._id
        }, (err, thing) => {
          if (err) throw err
          else {
            console.log("savedEntry is...", savedEntry);
            console.log("savedEntry.collectionStartUTC is...", savedEntry.collectionStartUTC);
            console.log("collectionStartUTC is...", collectionStartUTC);
            console.log("hehehehehe");
            res.redirect('/voiddeck')
          }
        })
      }
    })
  },

  editOrJoin: (req,res) => {
    Request.find({_id: req.params.id})
    .populate('author')
    .exec(function(err, authorInfo) {
      if (err) throw err

      else if (req.user.helper) { //low-hanging fruit, if user is alr a helper,
        //he shldn't even be allowed to click on editOrJoin
        req.flash('error', 'You are already helping another party!');
        res.redirect('/voiddeck')
      }

      else if (authorInfo[0].author.length) {

        for (var i=0; i<authorInfo[0].author.length; ++i) {
          //if while looping thru the for loop, there's a match then...
          if (authorInfo[0].author[i]._id.equals(req.user._id)) {
            // console.log("if loop is entered, editing request details and i is now ", i);
            // console.log("authorInfo[0].author[i]._id is ",authorInfo[0].author[i]._id);
            // console.log("req.user._id is ", req.user._id);

            res.redirect('/voiddeck/requests/'+authorInfo[0]._id+'/edit');
            return ;
            // res.redirect('/voiddeck')
          }
          // console.log("i is now ", i);
        }
        //out of the for loop,
        if (!req.user.party) {
          // console.log("else loop is entered, joining food party");
          // console.log("request id is ",authorInfo[0]._id);
          res.redirect('/voiddeck/requests/'+authorInfo[0]._id+'/join');
        }
        else if (req.user.party) {
          req.flash('error', 'You are already in another party! (Leave/delete your party first)');
          res.redirect('/voiddeck')
        }

      }
      // else {
      //   console.log("PARTY IS FULL");
      //   res.redirect('/voiddeck');
      // }
    })
  },

  editPage: (req,res) => {
    console.log(req.params);
    Request.findById(req.params.id, (err, request) => {
      if (err) throw err
      // else if request.author is not req.user._id then redirect to another page with flash msg
      else {
        User.findOne({
          _id: req.user._id
        }, (err, currentUserInfo) => {
          if (err) throw err
          else {
            console.log("currentUserInfo is ", currentUserInfo);
            res.render('voiddeck/editRequest', { request: request, currentUserInfo: currentUserInfo})
          }
        })
        // console.log("we are here: ", requestItem);
        // res.render('voiddeck/editRequest', { requestItem: requestItem})
        //fill the form with values from requestItem in the editRequest form
      }
    })
  },

  makeEdit: (req,res) => {
    // console.log("req.params is: ", req.params);

    let newCollectionStartUTC = millisecondConverter(req.body.collectionStartDate, req.body.collectionStartHour, req.body.collectionStartMin);
    let newCollectionEndUTC = millisecondConverter(req.body.collectionEndDate, req.body.collectionEndHour, req.body.collectionEndMin);
    let dateNowUTC = Date.now();

    Request.findOne({
      _id: req.params.id
    }, (err, thisRequest) => {
      if (err) throw err

      else if ((newCollectionStartUTC < dateNowUTC) || (newCollectionStartUTC >= newCollectionEndUTC )) {
        req.flash('error', 'Your new collection time range is not valid.');
        res.redirect("/voiddeck/requests/"+thisRequest._id+"/edit");
      }
      else {

        Request.findOneAndUpdate({
          _id: req.params.id
        }, {

          food: req.body.foodItem,
          destination: req.body.destination,

          collectionStartDate: req.body.collectionStartDate,
          collectionEndDate: req.body.collectionEndDate,
          collectionStartHour: req.body.collectionStartHour,
          collectionStartMin: req.body.collectionStartMin,
          collectionEndHour: req.body.collectionEndHour,
          collectionEndMin: req.body.collectionEndMin,
          collectionStartUTC: newCollectionStartUTC,
          collectionEndUTC: newCollectionEndUTC
        }, (err, editedRequest) => {
          if (err) throw err
          req.flash("success", "Your request has been successfully edited")
          res.redirect('/voiddeck/requests/view');
        })
      }
    })

    // Request.findOneAndUpdate({
    //   _id: req.params.id
    // }, {
    //   foodItem: req.body.foodItem,
    //
    //   destination: req.body.destination,
    //   latestBy: req.body.latestBy,
    //
    //   collectionStartDate: req.body.collectionStartDate,
    //   collectionEndDate: req.body.collectionEndDate,
    //   collectionStartTime: req.body.collectionStartTime,
    //   collectionEndTime: req.body.collectionEndTime,
    //   collectionStartUTC: millisecondConverter(req.body.collectionStartDate, req.body.collectionStartTime),
    //   collectionEndUTC: millisecondConverter(req.body.collectionEndDate, req.body.collectionEndTime)
    // }, (err, requestItem) => {
    //   if (err) throw err
    //   res.redirect('/voiddeck/requests/view');
    // })
  },

  joinPage: (req,res) => {

    Request.findOne({
      _id: req.params.id
    }, (err, requestItem) => {
      if (err) throw err
      else {
        res.render('voiddeck/joinRequest', {requestItem:requestItem});
      }
    })

  },

  makeJoin: (req,res) => {
    console.log("you are at the right place");
    console.log("req.params is: ", req.params);
    Request.findOneAndUpdate({
      _id: req.params.id
    }, {

    }, (err, requestItem) => {
      if (err) throw err
      else {
        console.log("successfully entered into makeJoin");

        req.user.party = requestItem._id;
        req.user.foodItem = req.body.foodItem;
        req.user.save();

        requestItem.food.push(req.body.foodItem);
        console.log("req.user is ", req.user);
        requestItem.members.push(req.user.name);
        requestItem.author.push(req.user._id);

        requestItem.save(function(err,savedEntry) {
          if (err) throw err
          else {
            console.log(requestItem);
            res.redirect('/voiddeck/requests/view');
          }
        })

        // console.log(requestItem);

      }
    })
  },

  help: (req,res) => {
    if (req.user.party) { //meaning user is alr in a party
      req.flash('error', 'You are already in a party! (Leave/delete your party before helping others)');
      res.redirect('/voiddeck');
    }
    else if (req.user.helper) {
      req.flash('error', 'You are already a helper for another party! (Complete that quest first)');
      res.redirect('/voiddeck');
    }
    else {
      res.redirect('/voiddeck/help/'+req.params.id)
    }
  },

  helpPage: (req,res) => {
    console.log("helpPage supposed to be loaded, req.params is", req.params);
    Request.findOne({
      _id: req.params.id
    }, (err, requestItem) => {
      if (err) throw err
      else {
        console.log("This is requestItem", requestItem);
        res.render('voiddeck/helpDeliver', {requestItem: requestItem});
      }
    })
  },

  makeHelp: (req,res) => {

    let deliveryStartUTC = millisecondConverter(req.body.deliveryStartDate, req.body.deliveryStartHour, req.body.deliveryStartMin);
    let deliveryEndUTC = millisecondConverter(req.body.deliveryEndDate, req.body.deliveryEndHour, req.body.deliveryEndMin);
    let dateNowUTC = Date.now();

    // let deliveryStartUTC = millisecondConverter(req.body.deliveryStartDate, req.body.deliveryStartTime);
    // let deliveryEndUTC = millisecondConverter(req.body.deliveryEndDate, req.body.deliveryEndTime);

    Request.findOne({
      _id: req.params.id
    }, (err, requestToBeChecked) => {
      if (err) throw err
      else if ((deliveryStartUTC < requestToBeChecked.collectionStartUTC) || (deliveryEndUTC > requestToBeChecked.collectionEndUTC) ) {
        req.flash('error', 'Please enter a valid new time range (has to be within the old collection time range).')
        res.redirect('/voiddeck/help/'+req.params.id);
      }
      else {
        console.log("we are HERE IN THE MAKEHELP FORM");
        req.user.helper = true;
        req.user.save();
        Request.findOneAndUpdate({
          _id: req.params.id
        }, {
          deliveryStartDate: req.body.deliveryStartDate,
          deliveryEndDate: req.body.deliveryEndDate,
          deliveryStartTime: req.body.deliveryStartTime,
          deliveryEndTime: req.body.deliveryEndTime,
          deliveryStartUTC: deliveryStartUTC,
          deliveryEndUTC: deliveryEndUTC
        }, (err, requestToBeHelped) => {
          if (err) throw err
          else {
            requestToBeHelped.helper.push(req.user.name);
            requestToBeHelped.author.push(req.user._id);
            requestToBeHelped.save();
            // res.flash('success','You are now helping deliver food')
            res.redirect('/voiddeck');
          }
        })
      }
    })
  },

  confirm: (req,res) => {
    Request.findOne({
      _id: req.params.id
    }, (err, thisRequest) => {
      if (err) throw err

      else if (thisRequest.numberOfConfirmedDelivery === thisRequest.members.length+1) {
        // ^ when EVERYONE (helper + members) has confirmed 'delivered' and 'received'
        console.log("last person has clicked on button");
        res.redirect('/voiddeck');
      }
      else { //individual confirmations
        req.user.confirmedDelivery = true;
        req.user.save();
        thisRequest.numberOfConfirmedDelivery++;
        thisRequest.save();
        res.redirect('/voiddeck');
      }
    } )
  },

  delete: (req,res) => {
    Request.findOne({
      _id: req.params.id
    }, (err, requestToBeDeleted) => {
      if (err) throw err
      else {
        console.log("requestToBeDeleted is...", requestToBeDeleted);
        if (requestToBeDeleted.members.length === 1) {
          Request.findByIdAndRemove(requestToBeDeleted._id, (err, requestItem) => {
            if (err) throw err
            else {
              User.findOneAndUpdate({
                _id: req.user._id
              }, {
                foodItem: null,
                party: null
              }, (err, nowDelete) => {
                res.redirect('/voiddeck/requests/view')
              })
            }
          })
        }
        else {
          let thisIndex = requestToBeDeleted.members.indexOf(req.user.name);
          requestToBeDeleted.members.splice(thisIndex,1);
          requestToBeDeleted.food.splice(thisIndex,1);
          requestToBeDeleted.author.splice(thisIndex,1);
          requestToBeDeleted.save();

          User.findOneAndUpdate({
            _id: req.user._id
          }, {
            foodItem: null,
            party: null
          }, (err, nowDelete) => {
            res.redirect('/voiddeck/requests/view')
          })
        }
      }
    })
    console.log("req.params is.........", req.params);
    // Request.findByIdAndRemove(req.params.id, (err, requestItem) => {
    //   if (err) throw err
    //   res.redirect('/voiddeck/requests/view')
    // })
  },

  createOfferPage: (req,res) => {
    res.render('voiddeck/createOffer')
  },

  createOffer: (req,res) => {
    var millisecondConverter = function(date,time) {
      let dateMS = date.split('-');
      let timeMS = time.split(':');
      let finalMS = new Date(dateMS[0],dateMS[1]-1,dateMS[2],timeMS[0],timeMS[1]);
      return finalMS.getTime();
    }

    let newRequest = new Request({
      author: req.user,
      foodItem: req.body.foodItem,
      foodShop: req.body.foodShop,
      destination: req.body.destination,
      latestBy: req.body.latestBy,
      deliveryStart: millisecondConverter(req.body.deliveryDateStart, req.body.deliveryTimeStart),
      deliveryEnd: millisecondConverter(req.body.deliveryDateStart, req.body.deliveryTimeStart)
    })
    newRequest.save(function (err, savedEntry) {
      if (err) throw err
      res.redirect('/voiddeck')
    })
  }
}
module.exports = voiddeckController
