'use strict';

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var redis = require("redis");
var client = redis.createClient();

router.use(function(request, response, next){
		console.log('This is middleware AFTER1');

  		console.log(response.content);

  		var str = JSON.stringify(response.content);

		var md5 = crypto.createHash('md5');
		var tag = md5.update(str).digest('base64');
		console.log(tag);

		response.setHeader('ETag', tag);

		console.log(request.url);

		client.on("error", function (err) {
        	console.log("Error " + err);
    	});

		client.set(request.url, tag, redis.print);

		// client.get(request.url, function(err, reply) {
  //   	// reply is null when the key is missing
  //   		console.log(reply);
		// });

		response.status(response.statuscode).json(response.content)

		next();
	});


module.exports = router;