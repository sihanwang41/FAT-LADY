'use strict';
// Loading the express library
var express = require('express');
var app = express();

var async = require('async');

var service = require('./routes/index');
var logError = require('./routes/logerror');
var errorHandler = require('./routes/errorhandler');


// Testing configurable middleware
var confirguration = {
	auth: {
		priority: 100,
		enable: true
	},
	before1: {
		priority: 99,
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

var auth = require('./example_middleware/auth');
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

function configurableMiddleWare(req, res, next) {
   
   	var operations = [];

   	var middleware;

   	var sortedConfig = sortConfig(confirguration);

   // push each middleware you want to run
   	sortedConfig.forEach(function(fn) {

   		switch(fn[0]){
			case 'auth':
				middleware = auth;
				break;
			case 'before1':
				middleware = before1;
				break;
			case 'before2':
				middleware = before2;
				break;
			case 'service':
				middleware = service;
				break;
			case 'after1':
				middleware = after1;
				break;
			case 'after2':
				middleware = after2;
				break;
		}

		// console.log(fn[0]);
		// console.log(middleware);
	
		// Push the middleware into the array and pass the variable to it
   		operations.push(middleware.bind(middleware, req, res)); // could use fn.bind(null, req, res) to pass in vars  
   	});

   	console.log('middleware list sorted');
   // now actually invoke the middleware in series
   	async.series(operations, function(err) {
   		if(err) {
   	    	console.log('Something blew up!!!!!!');
   			return next(err);
   	  	}
   	  	console.log('middleware get executed');
   	  	// no errors so pass control back to express
   	  	next();
   	});

}

app.use('/service', configurableMiddleWare);

app.use(logError);
app.use(errorHandler);


// export the module so that it could be called elsewhere
module.exports = app;