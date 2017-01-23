const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn');
const Todo = require('../models/todo');
const homepageController = require('../controllers/homepage_controller')
const voiddeckController = require('../controllers/voiddeck_controller')

//basic register/login functions
router.get('/', homepageController.index);
router.get('/register', homepageController.registrationPage);
router.post('/register', homepageController.register);
router.get('/login', homepageController.loginPage);
router.post('/login', homepageController.login);
router.get('/logout', homepageController.logout);

//lobby - view all posted requests and offers
router.get('/voiddeck', voiddeckController.index);
router.get('/voiddeck/requests/view', voiddeckController.listRequests);
router.get('/voiddeck/requests/create', isLoggedIn, voiddeckController.createRequestPage);
router.post('/voiddeck/requests/create', isLoggedIn, voiddeckController.createRequest);
router.get('/voiddeck/requests/:id', isLoggedIn, voiddeckController.updateOrCommitTest);
// router.put('/voiddeck/requests/:id', isLoggedIn, voiddeckController.updateOrCommitTest);
router.get('/voiddeck/requests/:id/edit', isLoggedIn, voiddeckController.editPage);

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
