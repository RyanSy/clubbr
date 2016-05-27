var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');

var randomstring = require("randomstring");
var formidable  = require("formidable");

var Event = require('../models/models.js')[0];
var User = require('../models/models.js')[1];

//main landing page
router.get('/', function(req,res) {
	var session = {
		logged_in : req.session.logged_in,
		username : req.session.username
	}
	res.render('events/index', {session, layout:"other"});
});

//route for user search
router.post('/events', function(req,res) {
	Event.findAll({
		where: {
			$or: [{name: req.body.searchTerm}, {genre: req.body.searchTerm}, {venue: req.body.searchTerm}]
		}
	}).then(function(result){
		var hbsObject = {
			events : result,
			logged_in : req.session.logged_in,
			username : req.session.username
		}
		res.render('events/results', hbsObject);
	});
});

// routes for event creation
router.get('/events/create', function(req,res) {
	var session = {
		logged_in : req.session.logged_in,
		username : req.session.username
	}
	res.render('events/create', session);
});

router.post('/events/create', function(req,res) {
//res.end(JSON.stringify(req.files) + "\n");
	// fs.readFile(req.files.image.path, function (err, data) {
	// var newPath = __dirname + "/../public/assets/images";
	// fs.writeFile(newPath, data, function (err) {
	// 	});
	// });


	var form = new formidable.IncomingForm();

console.log(form);

//console.log(req);
	//console.log(files.upload.path);
	var userID = req.session.user_id;
	console.log(process.cwd());
	var uploadLocation = process.cwd()+ "/public/assets/images/";
	var uploadFilename = userID+"_"+randomstring.generate(7)+".png";

	form.parse(req, function(error, fields, files) {
    console.log("parsing done");

console.log(uploadLocation+uploadFilename);
console.log(fields);
console.log(files);


fs.rename(files.image.path, uploadLocation+uploadFilename, function(error) {
	if (error) {
		console.log(error);
		fs.unlink("/tmp/test.png");
		fs.rename(files.image.path, "/tmp/test.png");
	}

//res.send("<img src='/assets/images/"+uploadFilename+"'>");


Event.create({
	name: fields.name,
	genre: fields.genre,
	venue: fields.venue,
	image: uploadFilename,
	user_id: req.session.user_id
}).then(function(){
	res.redirect("/events/myevents");
});


});



});


});

// route to show events that user created
router.get('/events/myevents', function(req,res) {
	var session = {
		logged_in : req.session.logged_in,
		username : req.session.username
	}
	Event.findAll({
		where: {
			user_id: req.session.user_id
		}
	}).then(function(result){
		var hbsObject = {
			events : result,
			logged_in : req.session.logged_in,
			username : req.session.username
		}
	res.render('events/myevents', hbsObject);
	});
});

// routes to update event
 // view update page
router.post('/events/update', function(req,res) {
	Event.findAll({
		where: {
			id: req.body.id
		}
	}).then(function(result){
		var hbsObject = {
			events : result,
			logged_in : req.session.logged_in,
			username : req.session.username
		}
		res.render("events/update", hbsObject);
	});
});
	//post route to save changes
router.post('/events/myevents', function(req,res) {
		Event.update({
			name: req.body.name,
			genre: req.body.genre,
			venue: req.body.venue,
			user_id: req.session.user_id
		}, {
			where: {
				id: req.body.id
			}
		}).then(function(){
			// res.redirect('/')
			res.redirect("/events/myevents");
		});
	});

// route to delete event
router.post('/events/confirm-delete', function(req,res) {
		if (req.session.logged_in){
			//check if event belongs to user then let user delete event
			Event.findAll({
		    where: {$and: [{user_id: req.session.user_id}, {id: req.body.id}]}
		  }).then(function(result) {
				var hbsObject = {
					events : result,
					logged_in : req.session.logged_in,
					username : req.session.username
				}
				res.render("events/confirm-delete", hbsObject)
			});
		} else {
			res.send("Sorry you can't do that. You need to be logged in.");
		}
	});

router.post('/events/delete', function(req,res) {
		if (req.session.logged_in){
			//check if event belongs to user then let user delete event
			Event.findAll({
		    where: {$and: [{user_id: req.session.user_id}, {id: req.body.id}]}
		  }).then(function(events) {
				if (events.length > 0){
					Event.destroy({
						where: { id : req.body.id }
					}).then(function (result) {
						res.redirect('/events/myevents');
					}, function(rejectedPromiseError){
						console.log(rejectedPromiseError);
					});
				}else{
					res.send("sorry you can't delete that event.");
				}
			});
		} else {
			res.send("Sorry you can't do that. You need to be logged in.");
		}
	});

module.exports = router;
