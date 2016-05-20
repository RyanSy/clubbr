/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var session = require('express-session');

var Cat = require('../models/models.js')[0];
var User = require('../models/models.js')[1];

//this is the users_controller.js file
router.get('/users/sign-in', function(req,res) {
	res.render('users/sign-in');
});

router.get('/users/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

router.post('/users/sign-in', function(req, res) {
  User.findOne({
    where: {email: req.body.email}
  }).then(function(user) {
    bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
        if (result == true){
          //make session

          req.session.logged_in = true;
          req.session.user_id = user.id;
          req.session.user_email = user.email;
          req.session.username = user.username;

          res.redirect('/');
        }
				else {
					res.send("The password is incorrect. Click back and try again.")
				}
    });
  })
});

router.get('/users/new', function(req,res) {
	res.render('users/new');
});

//to do: check if the username/email exist - if they do then redirect the user back to the signup page and say sorry you need to choose a new name
router.post('/users/create', function(req,res) {
	User.findAll({
    where: {$or: [{email: req.body.email}, {username: req.body.username}]}
  }).then(function(users) {
		if (users.length > 0){
			console.log(users)
			res.send('We already have an email or username for this account.')
		}else{
			bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, hash) {
						User.create({
							username: req.body.username,
							email: req.body.email,
							password_hash: hash
						}).then(function(user){

							req.session.logged_in = true;
							req.session.user_id = user.id;
							req.session.user_email = user.email;
							req.session.username = user.username;
							res.redirect('/');
						});
					});
			});

		}
	});
});

module.exports = router;
