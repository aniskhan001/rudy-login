var express		= require('express');
var app 		= express();
var passport	= require('passport');
var bodyParser 	= require('body-parser');
var port 		= process.env.PORT || 5000;

// for pasring request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport init
app.use(passport.initialize());

// Start route
app.get('/', function(req, res) {
	res.send('API access on http://localhost:' + port + '/api');
});

// API routes
var apiRoutes = require('./api/routes')
app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('App started at: http://localhost:' + port);