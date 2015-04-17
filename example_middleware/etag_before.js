'use strict';

var express = require('express');
var router = express.Router();

// Redis connection
var redis = require("redis");
var client = redis.createClient();

router.use(function(request, response, next){
		console.log('This is middleware Etag BEFORE');

		console.log("The method is " + request.method)
		if (request.method == "GET")
		{
			if (request.headers['if-none-match'] != null && request.headers['if-modified-since'] != null)
			{
				console.log("if-none-match header is: " + request.headers['if-none-match']);
				console.log("if-modified-since header is: " + request.headers['if-modified-since']);

				client.get(request.url, function(err, reply) {
    				// reply is null when the key is missing
    				// console.log(reply);
    				var json_obj = JSON.parse(reply);
    				var x = new Date(json_obj.LastModified);
    				var y = new Date(request.headers['if-modified-since']);
    				console.log('x: ' + x + ', y: ' + y);

    				// console.log("Etag in json: " + json_obj.Etag);
    				// console.log("Last-Modified in json: " + json_obj.LastModified);
    				if (json_obj.Etag == request.headers['if-none-match'] && x >= y)
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
						console.log("Headers do not match");
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
    				var json_obj = JSON.parse(reply);
    				console.log(json_obj.Etag);

    				if (json_obj.Etag != request.headers['if-match'])
    				{
    					console.log("412 Precondition failed");
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
				console.log("403 Forbidden");
  				response.statuscode = 403;
  				next();
			}
		}
		else if (request.method == "POST")
		{
			next();
		}

	});


module.exports = router;