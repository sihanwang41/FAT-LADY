var express = require('express');

// Body-parser
var bodyParser = require('body-parser');
// We need to catch JSON, need to change
var jsonParser = bodyParser.json();

// HTTP proxy
var http = require('http');

var options = {
  host: '127.0.0.1',
  port: 9000,
  path: '/customers',
  method: '',
  headers: {}
};


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
// GET on '/customers'
	.get(function(request, response){
		//if (error) throw error;
		response.json("OK");
	})

// POST on '/customers'
	.post(jsonParser, function(request, response){
		// Setting up the proxy for post
		var proxy = options;
		var json = '';
		// Construct the request to API
		proxy.method = 'POST';
		proxy.path = '/customers';
		proxy.headers['Content-Type'] = request.get('Content-Type');
		var data = JSON.stringify(request.body);

		// 400 Bad request if no JSON was received
		if (!request.body) return response.sendStatus(400);

		console.log(proxy);

		var req = http.request(proxy, function(hres) {
		    // hres.setEncoding('utf8');
		    hres.on('data', function (chunk) {
		    	json += chunk;
		        console.log("body: " + chunk);
		    });
		    
		    hres.on('end', function () {
        		console.log("Got response: " + hres.statusCode);
        		//console.log(jsonRes);
        		var jsonRes = JSON.parse(json);
        	    response.status(200).json(jsonRes);
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
		client.hdel('customers', request.params.id, function(error){
			if (error) throw error;
			response.sendStatus(204);
		});
	})

	.get(function(request, response){
		var proxy = options;
		var json = '';
		// Construct the request to API
		proxy.method = 'GET';
		proxy.path = '/customers/' + request.params.id;
		console.log(proxy);

		http.get(proxy, function(hres){
			hres.on('data', function (chunk) {
        	    json += chunk;
        	 });
	
        	hres.on('end', function () {
        		console.log("Got response: " + hres.statusCode);
        		var jsonRes = JSON.parse(json);
        		//console.log(jsonRes);
        	    response.status(200).json(jsonRes);
        	});

		}).on('error', function(e){
			response.json(e);
		})
	});

module.exports = router;