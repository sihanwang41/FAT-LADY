'use strict';
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
// Fake request to simulate the /service
var fakeRequest = require('./example_middleware/fake_request');

// Function to sort the order of the middleware to be executed
var sortConfig = function(confirguration){
	var sortable = [];
	for (var middleware in confirguration)
		// To make middlewares configurable
		if (confirguration[middleware]['enable'] == true){
			sortable.push([middleware, confirguration[middleware]['priority']]);
		}
	    
	sortable.sort(function(a, b) {return b[1] - a[1]});
	return sortable;
}

// var sortedConfig = [];
var middlewareSet = new Array();
app.use('/test', function(request, response, next){
	var middleware;
	var sortedConfig = sortConfig(confirguration);

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
		// Execute the middleware in expected order
		middlewareSet.push(middleware);
	}
	// request.sortedConfig = sortedConfig;
	console.log(middlewareSet);
	console.log('middleware list sorted');
	next();
});

app.use('/test', [before1, before2, fakeRequest, after1, after2]);

// app.use('/test', function(request, response, next){
// 	walkSubstack(middleware, req, res, next)
// });

// console.log([before1, before2]);

// Testing if example middlewares are working
// app.use('/test', before1);
// app.use('/test', before2);
// app.use('/test', fakeRequest);
// app.use('/test', after1);
// app.use('/test', after2);


// Assign the function of the actual middleware



app.use('/service', service);

var walkSubstack = function (stack, req, res, next) {

  if (typeof stack === 'function') {
    stack = [stack];
  }

  var walkStack = function (i, err) {

    if (err) {
      return next(err);
    }

    if (i >= stack.length) {
      return next();
    }

    stack[i](req, res, walkStack.bind(null, i + 1));

  };

  walkStack(0);

};




// export the module so that it could be called elsewhere
module.exports = app;