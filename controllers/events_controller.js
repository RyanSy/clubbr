/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();

var Event = require('../models/models.js')[0];
var User = require('../models/models.js')[1];

router.get('/', function(req,res) {
	res.render('events/index');
});

router.post('/events', function(req,res) {
	Event.findAll({
		where: {
			$or: [{name: req.body.searchTerm}, {genre: req.body.searchTerm}, {venue: req.body.searchTerm}, {city: req.body.searchTerm}]
		}
	}).then(function(result){
		var hbsObject = {
			events : result,
			logged_in : req.session.logged_in,
			username : req.session.username
		}
		res.send(result);
	})
});

//
// router.post('/events/create', function(req,res) {
// 	Event.create({
// 		name: req.body.name,
// 		genre: req.body.genre,
// 		venue: req.body.venue,
// 		user_id: req.session.user_id
// 	}).then(function(newlyCreatedevent){
// 		res.redirect('/events')
// 	});
// });

// router.delete('/events/delete/:id', function(req,res) {
// 	if (req.session.logged_in){
// 		//check if event belongs to user then let user delete event
// 		Event.findAll({
// 	    where: {$and: [{user_id: req.session.user_id}, {id: req.params.id}]}
// 	  }).then(function(events) {
// 			if (events.length > 0){
// 				events.destroy({
// 					where: { id : req.params.id }
// 				}).then(function (result) {
// 					res.redirect('/events');
// 				}, function(rejectedPromiseError){
// 					console.log(rejectedPromiseError);
// 				});
// 			}else{
// 				res.send("sorry you can't delete that event.");
// 			}
// 		});
// 	}else {
// 		res.send("sorry you can't do that. You need to be logged in");
// 	}
//
// });

module.exports = router;
