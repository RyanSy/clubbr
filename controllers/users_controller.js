/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var session = require('express-session');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var fs = require('fs');
var keys = require('../../APIkeys/sendgridKeys.js');
var sendgrid  = require('sendgrid')(keys.sendgridKeys.key);
var crypto = require('crypto');
var bodyParser = require('body-parser');
var sequelize = require('./../config/connection.js');
var handlebars = require('express-handlebars');

var Event = require('../models/models.js')[0];
var User = require('../models/models.js')[1];

router.get('/users/sign-in', function(req,res) {
	res.render('users/sign-in');
});

router.post('/users/sign-in', function(req, res) {
  User.findOne({
    where: {email: req.body.email}
  }).then(function(user) {
    bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
        if (result == true){
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

router.get('/users/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

router.get('/users/new', function(req,res) {
	res.render('users/new');
});

router.post('/users/create', function(req,res) {
	User.findAll({
    where: {$or: [{email: req.body.email}, {username: req.body.username}]}
  }).then(function(users) {
		if (users.length > 0){
			console.log(users)
			res.send('We already have an email or username for this account.')
		}
		else {
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

//user reset password
router.get('/users/forgot', function(req,res) {
	res.render('users/forgot', {
		user: req.user
	});
});

router.post('/users/forgot', function(req,res) {
	User.findOne({
		where: {email: req.body.email}
	}).then(function(user) {
		if (user == undefined) {
			res.send('No account with that email address exists.');
		}
		else {
			crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
				user.resetPasswordToken = token;
				sequelize.query("UPDATE users SET resetPasswordToken=':"+token+"' WHERE email='"+req.body.email+"';");
				sequelize.query("UPDATE users SET resetPasswordExpires=DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email='"+req.body.email+"';");
				sendgrid.send({
				  to:       req.body.email,
				  from:     'noreply@clubber.app',
				  subject:  'Clubbr Password Reset',
				  html:     '<p>Click on the link to reset your password: http://localhost:3000/users/reset/:'+token+'<br><br>This is an automtically generated email. Replies to this email address will go nowhere.'

				}, function(err, json) {
				  if (err) { return console.error(err); }
				  console.log(json);
				});//end sendgrid
      }); //end crypto
			res.send(" An email has been sent to you with a link to reset your password.");
		} //end else statement
	}); //end user.findOne().then()
}); //end users forgot post route

router.get('/users/reset/:token', function(req, res) {
  User.findOne({
		where: {
			resetPasswordToken: req.params.token,
			resetPasswordExpires: {$gt: Date.now()}
		}
	}).then(function(user) {
    if (user == null) {
      res.send('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {
      user: req.user
    });
  });
});

router.post('/users/reset', function(req,res) {
		if (req.body.newPassword == req.body.confirmPassword) {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
					sequelize.query("UPDATE users SET password_hash='"+hash+"' WHERE email='"+req.body.email+"';");
				});
			});
			res.send("Password successfully changed.");
		}
		else {
			res.send("Passwords do not match. PLease click back and try again.")
		}
});


module.exports = router;
