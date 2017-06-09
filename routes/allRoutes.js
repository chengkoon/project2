const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

const homepageController = require('../controllers/homepage_controller')
const voiddeckController = require('../controllers/voiddeck_controller')

//basic register/login functions
router.get('/', homepageController.index);
router.get('/register', homepageController.registrationPage);
router.post('/register', homepageController.register);
router.get('/login', homepageController.loginPage);
router.post('/login', homepageController.login);
router.get('/logout', homepageController.logout);

//lobby - view all posted requests
router.get('/voiddeck', voiddeckController.listRequests);
router.get('/voiddeck/requests/view', isLoggedIn, voiddeckController.listRequests);
router.get('/voiddeck/requests/user', isLoggedIn, voiddeckController.userRequests);
router.get('/voiddeck/requests/create', isLoggedIn, voiddeckController.createRequestPage);
router.post('/voiddeck/requests/create', isLoggedIn, voiddeckController.createRequest);

//to edit:
router.get('/voiddeck/requests/:id/edit', isLoggedIn, voiddeckController.editPage);
router.put('/voiddeck/requests/:id', isLoggedIn, voiddeckController.makeEdit);

//delivery received:
router.put('/voiddeck/requests/received/:id', isLoggedIn, voiddeckController.deliveryReceived);

//claim rewards:
router.put('/voiddeck/requests/claimReward/:id', isLoggedIn, voiddeckController.transferTokens);

router.put('/voiddeck/help/:id', isLoggedIn, voiddeckController.helpDeliver);

//to delete:
router.delete('/voiddeck/requests/:id', isLoggedIn, voiddeckController.delete);


router.get('/profile', isLoggedIn, function (req, res) {
  Todo.find({author: req.user._id}, function (err, todos) {
    if (err) res.status(404).json({msg: 'cannot find any todos'})
    else {
      console.log("todos are ", todos);
      // res.render('profile', {something:todos});
      res.render('profile',{name:req.user.name, id:req.user._id, something:todos})
    }
  })
})

router.get('/new', isLoggedIn, function(req, res){
  res.render('new');
});

router.post('/new', function (req, res) {

  Todo.create({
    author:req.user._id,
    name:req.body.name,
    description: req.body.description,
    completed: req.body.completed
  }, function (err, todo) {
    if (err) res.status(422).json({msg: 'Could not ceate todo because:' + err})
    else {
      console.log(req.user._id);
      res.status(201).redirect('/profile')
    }
  })
})

module.exports = router
