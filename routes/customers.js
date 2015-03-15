var express = require('express');

// Body-parser
var bodyParser = require('body-parser');
// We need to catch JSON, need to change
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
	.all(function(){

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
		
		//var json = '';
		
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
		
		var json = '';
		 
		var data = JSON.stringify(request.body);

		// 400 Bad request if no JSON was received
		if (!request.body) return response.sendStatus(400);

		console.log(options);

		// makeRequest(options, data, response);

		var req = http.request(options, function(hres) {
			console.log('STATUS: ' + hres.statusCode);
  			console.log('HEADERS: ' + JSON.stringify(hres.headers));
  			hres.setEncoding('utf8');
		    // hres.setEncoding('utf8');
		    hres.on('data', function (chunk) {
		    	json += chunk;
		        console.log("body: " + chunk);
		    });
		    
		    hres.on('end', function () {
        		console.log("Got response: " + hres.statusCode);
        		//console.log(jsonRes);
        		var jsonRes = JSON.parse(json);
        	    response.status(hres.statusCode).json(jsonRes);
        	});
		});

		req.write(data);
		req.on('error', function(e) {
  			console.log('problem with request: ' + e.message);
		});
		req.end();
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
		
		var json = '';
		

		console.log(options);

		var req = http.request(options, function(hres) {
			console.log('STATUS: ' + hres.statusCode);
  			console.log('HEADERS: ' + JSON.stringify(hres.headers));
  			hres.setEncoding('utf8');
	
		    hres.on('data', function (chunk) {
		    	json += chunk;
		        console.log("body: " + chunk);
		    });
		    
		    hres.on('end', function () {
        		console.log("Got response: " + hres.statusCode);
        		//console.log(jsonRes);
        	    response.status(hres.statusCode).json(json);
        	});
		});

		req.on('error', function(e) {
  			console.log('problem with request: ' + e.message);
		});
		req.end();	
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

		var json = '';
		
		var data = JSON.stringify(request.body);

		// 400 Bad request if no JSON was received
		if (!request.body) return response.sendStatus(400);

		console.log(options);

		// makeRequest(options, data, response);

		var req = http.request(options, function(hres) {
			console.log('STATUS: ' + hres.statusCode);
  			console.log('HEADERS: ' + JSON.stringify(hres.headers));
  			hres.setEncoding('utf8');
		    hres.on('data', function (chunk) {
		    	json += chunk;
		        console.log("body: " + chunk);
		    });
		    
		    hres.on('end', function () {
        		console.log("Got response: " + hres.statusCode);
        		
        	    response.status(hres.statusCode).json(json);
        	});
		});

		req.write(data);
		req.on('error', function(e) {
  			console.log('problem with request: ' + e.message);
		});
		req.end();
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