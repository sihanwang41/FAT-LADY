var express = require('express');

// Body-parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// HTTP proxy
var http = require('http');
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
router.route('/')
	.all(function(request, response, next){
		next();
	})
// GET on '/customers'
	.get(function(request, response){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: '/customers',
		  	method: request.method,
		  	headers: {}
		};
				
		console.log(options);

		makeRequest(options, null, response);
	})

// POST on '/customers'
	.post(jsonParser, function(request, response){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: '/customers',
		  	method: request.method,
		  	headers: {
		  		'Content-Type' : request.get('Content-Type')
		  	}
		};
		
		var data = JSON.stringify(request.body);
		console.log(data);

		// 400 Bad request if no JSON was received
		if (data == '{}'){
			return response.sendStatus(400);
		}

		console.log(options);

		makeRequest(options, data, response);
	});


router.route('/:id')
// DELETE on '/customers'
	.delete(function(request, response){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: '/customers/' + request.params.id,
		  	method: request.method,
		  	headers: {}
		};

		console.log(options);

		makeRequest(options, null, response);
	})

	.put(jsonParser, function(request, response){
		// Setting up the proxy for post
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: '/customers/' + request.params.id,
		  	method: request.method,
		  	headers: {
		  		'Content-Type' : request.get('Content-Type')
		  	}
		};
		
		var data = JSON.stringify(request.body);
		// console.log(data);

		// 400 Bad request if no JSON was received
		if (data == '{}'){
			return response.sendStatus(400);
		}

		console.log(options);

		makeRequest(options, data, response);
	})


	.get(function(request, response){
		// Construct the request to API
		var options = {
		  	host: '127.0.0.1',
		  	port: 9000,
		  	path: '/customers/' + request.params.id,
		  	method: request.method,
		  	headers: {}
		};
		
		console.log(options);

		makeRequest(options, null, response);
	});

module.exports = router;