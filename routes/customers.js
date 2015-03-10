var express = require('express');

// Body-parser
var bodyParser = require('body-parser');
// We need to catch JSON, need to change
var urlencoded = bodyParser.urlencoded({ extended: false });

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
	.post(urlencoded, function(request, response){
		var newCustomer = request.body;
		if (!newCustomer.name || !newCustomer.description){
			response.sendStatus(400);
			//return false;
		}
		client.hset('customers', newCustomer.name, newCustomer.description, function(error){
			if (error) throw error;
	
			response.status(201).json(newCustomer.name);
		});
	});


router.route('/:name')
// DELETE on '/customers'
	.delete(function(request, response){
		client.hdel('customers', request.params.name, function(error){
			if (error) throw error;
			response.sendStatus(204);
		});
	})

	.get(function(request, response){
		// client.hget('customers', request.params.name, function(error, description){
	
		// });
		response.sendStatus(200);
	});

module.exports = router;