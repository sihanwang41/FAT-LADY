'use strict';

var express = require('express');

// Body-parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// HTTP proxy
var makeRequest = require('./make_request');


// Redis connection
var redis = require('redis');
var client = redis.createClient();

 // Select different database to run on
client.select((process.env.NODE_ENV || 'development').length);

// Now store the API key and API call into the Redis

// Using the Router to clean code up
// refer to '/customers'
var router = express.Router();

// GET on '/'
router.route('/:table')

	.all(function(request, response, next){

		response.table = request.params.table;
		if (response.table == 'address'){
			response.table = 'street_addresses';
		}

		if (response.statuscode == 304 || response.statuscode == 412 || response.statuscode == 403 || response.statuscode == 401)
			next('route');
		else
			next();
	})

// GET on '/customers'
	.get(function(request, response, next){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: request.url,
		  	method: request.method,
		  	headers: {}
		};
				
		console.log(options);
		// Make HTTP request
		makeRequest(options, null, response, next);
		// next('route');
	})

// POST on '/customers'
	.post(jsonParser, function(request, response, next){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: request.url,
		  	method: request.method,
		  	headers: {
		  		'Content-Type' : request.get('Content-Type')
		  	}
		};
		
		var data = JSON.stringify(request.body);
		console.log(data);

		// 400 Bad request if no JSON was received
		if (data == '{}'){
			response.statuscode = 403;
			// return response.sendStatus(400);
		}

		console.log(options);

		makeRequest(options, data, response, next);

		// next('route');
	});


router.route('/:table/:id')

	.all(function(request, response, next){

		response.table = request.params.table;
		if (response.table == 'address'){
			response.table = 'street_addresses';
		}

		if (response.statuscode == 304 || response.statuscode == 412 || response.statuscode == 403 || response.statuscode == 401)
			next('route');
		else
			next();
	})

// DELETE on '/customers'
	.delete(function(request, response, next){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: request.url,
		  	method: request.method,
		  	headers: {}
		};

		console.log(options);

		makeRequest(options, null, response, next);

		// next('route');
	})

	.put(jsonParser, function(request, response, next){
		// Setting up the proxy for post
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: request.url,
		  	method: request.method,
		  	headers: {
		  		'Content-Type' : request.get('Content-Type')
		  	}
		};
		
		var data = JSON.stringify(request.body);
		// console.log(data);

		// 400 Bad request if no JSON was received
		if (data == '{}'){
			response.statuscode = 403;
			// return response.sendStatus(400);
		}

		console.log(options);

		makeRequest(options, data, response, next);

		// next('route');
	})


	.get(function(request, response, next){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: request.url,
		  	method: request.method,
		  	headers: {}
		};
		
		console.log(options);

		makeRequest(options, null, response, next);

		// next('route');
	});

module.exports = router;