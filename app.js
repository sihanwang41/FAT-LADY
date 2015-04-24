'use strict';
// Loading the express library
var express = require('express');
var app = express();

var async = require('async');

var service = require('./routes/index');
var logError = require('./routes/logerror');
var errorHandler = require('./routes/errorhandler');

var configuration = require('./example_middleware/configuration');
var auth = require('./example_middleware/auth');
var Nonce = require('./example_middleware/Nonce');
var loggingBefore = require('./example_middleware/logging_before');
var etagBefore = require('./example_middleware/etag_before');
var loggingAfter = require('./example_middleware/logging_after');
var etagAfter = require('./example_middleware/etag_after');
// Fake request to simulate the /service
var fakeRequest = require('./example_middleware/fake_request');

/// Function to sort the order of the middleware to be executed
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
   
   	var config = req.configuration;
   	var operations = [];

   	var middleware;

   	var sortedConfig = sortConfig(config);

   // push each middleware you want to run
   	sortedConfig.forEach(function(fn) {

   		switch(fn[0]){
			case 'auth':
				middleware = auth;
				break;
			case 'Nonce':
				middleware = Nonce.checkNonce;
				break;
			case 'loggingBefore':
				middleware = loggingBefore;
				break;
			case 'etagBefore':
				middleware = etagBefore;
				break;
			case 'service':
				middleware = service;
				break;
			case 'loggingAfter':
				middleware = loggingAfter.log;
				break;
			case 'etagAfter':
				middleware = etagAfter;
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
   	    	loggingAfter.log(req, res);
   	  	}
   	  	console.log('middleware get executed');
   	  	// no errors so pass control back to expresss
   	  	next();
   	});

}
app.use('/service',configuration);

app.use('/service', configurableMiddleWare);

app.use(logError);
app.use(errorHandler);


// export the module so that it could be called elsewhere
module.exports = app;
