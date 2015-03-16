// Loading the express library
var express = require('express');
var app = express();

var service = require('./routes/index');


// Testing configurable middleware
var confirguration = {
	before1: {
		priority: 100,
		enable: true
	},
	before2: {
		priority: 80,
		enable: true
	},
	service: {
		priority: 50,
		enable: true
	},
	after1: {
		priority: 30,
		enable: true
	},
	after2: {
		priority: 10,
		enable: true
	}
}

var before1 = require('./example_middleware/before1');
var before2 = require('./example_middleware/before2');
var after1 = require('./example_middleware/after1');
var after2 = require('./example_middleware/after2');

// Function to sort the order of the middleware to be executed
var sortedConfig = [];

var sortConfig = function(confirguration){
	var sortable = [];
	for (var middleware in confirguration)
	    sortable.push([middleware, confirguration[middleware]['priority']]);

	sortable.sort(function(a, b) {return b[1] - a[1]});
	return sortable;
}

// Fake request to simulate the /service
var fakeRequest = function(request, response, next){
	response.send(200);
	next();
}

sortedConfig = sortConfig(confirguration);

for (var middlewareName in confirguration){

}



app.get('/',  function(request, response){
	response.send(200);
});


app.use('/service', service);



// export the module so that it could be called elsewhere
module.exports = app;