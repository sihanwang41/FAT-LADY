'use strict';

var express = require('express');
var router = express.Router();

// Redis connection
var redis = require("redis");
var client = redis.createClient();

router.use(function(request, response, next){
		console.log('This is middleware BEFORE1');

		console.log("The method is " + request.method)
		if (request.method == "GET")
		{
			if (request.headers['if-none-match'] != null)
			{
				console.log("if-none-match header is: " + request.headers['if-none-match']);

				client.get(request.url, function(err, reply) {
    				// reply is null when the key is missing
    				// console.log(reply);
    				if (reply == request.headers['if-none-match'])
					{
						console.log("304 not modified");
						// var err = new Error('304 not modified');
						// err.status = 304;
						// return next(err);
						response.status(304);
						response.statuscode = 304;
						next();
					}
					else
					{
						console.log("if-none-match header doesn't match");
						next();
					}
				});

			}
			else
			{
				console.log("No Etag in header");
				next();
			}


		}
		else if (request.method == "PUT" || request.method == "DELETE")
		{
			if (request.headers['if-match'] != null)
			{
				console.log("if-match header is: " + request.headers['if-match']);

				client.get(request.url, function(err, reply) {
    				// reply is null when the key is missing
    				// console.log(reply);
    				if (reply != request.headers['if-match'])
    				{
    					console.log("412 Precondition failed");
    					response.status(412);
						response.statuscode = 412;
						next();
    				}
					else
					{
						console.log("Etag matches, no changes");
						next();
					}
				});

			}
			else
			{
				console.log("412 Precondition failed");
				response.status(412);
				response.statuscode = 412;
				next();
			}
		}
		
	});


module.exports = router;