var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
// var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 60000000 }}));
// app.use(cookieParser());

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var events_controller = require('./controllers/events_controller.js');
var users_controller = require('./controllers/users_controller.js');

app.use('/', events_controller);
app.use('/', users_controller);


var port = process.env.PORT || 3000;
app.listen(port);
console.log("Connected established at port:" + port);
