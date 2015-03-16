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


app.use('/test', function(request, response){
	sortedConfig = sortConfig(confirguration);
	var middleware;

	// Assign the function of the actual middleware
	for (var i in sortedConfig){
		switch(sortedConfig[i][0]){
			case 'before1':
				middleware = before1;
				break;
			case 'before2':
				middleware = before2;
				break;
			case 'service':
				middleware = fakeRequest;
				break;
			case 'after1':
				middleware = after1;
				break;
			case 'after2':
				middleware = after2;
				break;
		}

		// console.log(sortedConfig[i][0]);
		app.use('/', middleware);
	}
});


app.use('/service', service);



// export the module so that it could be called elsewhere
module.exports = app;