'use strict';

var express = require('express');
var router = express.Router();

// MD5 hash
var crypto = require('crypto');

// Redis connection
var redis = require("redis");
var client = redis.createClient();

// Json Body Parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.use(function(request, response, next){

		// console.log(response.statuscode);

		if (response.statuscode == 304 || response.statuscode == 412 || response.statuscode == 403)
		{
			response.status(response.statuscode).send();

			next();
		}
		else
		{
			console.log('This is middleware AFTER1');

	  		console.log(response.content);

	  		var tableName = response.table;

	  		var last_update = response.content[tableName][0].last_update;

	  		var str = JSON.stringify(response.content);

			var md5 = crypto.createHash('md5');
			var tag = md5.update(str).digest('base64');

			response.setHeader('ETag', tag);
			response.setHeader('Last-Modified', last_update);

			var json = {"Etag": tag, "LastModified": last_update};
			var json_str = JSON.stringify(json);
			console.log(json_str);

			client.on("error", function (err) {
	        	console.log("Error " + err);
	    	});

			client.set(request.url, json_str, redis.print);

			// client.get(request.url, function(err, reply) {
	  //   	// reply is null when the key is missing
	  //   		console.log(reply);
			// });

			console.log("!!" + response.statuscode);
			
			response.status(response.statuscode).json(response.content);

			next();

		}
	});


module.exports = router;