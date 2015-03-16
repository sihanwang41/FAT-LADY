// Loading the express library
var express = require('express');
var app = express();

var service = require('./routes/index');


// Testing configurable middleware
var confirguration = {
	before1: {
		prioty: 100,
		enable: true
	},
	before2: {
		prioty: 80,
		enable: true
	},
	before1: {
		prioty: 50,
		enable: true
	},
	before1: {
		prioty: 30,
		enable: true
	},
	before1: {
		prioty: 10,
		enable: true
	},
}

var before1 = require('./example_middleware/before1');
var before2 = require('./example_middleware/before2');
var after1 = require('./example_middleware/after1');
var after2 = require('./example_middleware/after2');

var fakeRequest = function(request, response, next){
	response.send(200);
	next();
}



app.get('/',  function(request, response){
	response.send(200);
});


app.use('/service', service);



// export the module so that it could be called elsewhere
module.exports = app;