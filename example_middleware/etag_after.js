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

var http = require('http');

router.use(function(request, response, next){

		// console.log(response.statuscode);

		if (response.statuscode == 304 || response.statuscode == 412 || response.statuscode == 403 || response.statuscode == 401)
		{
			// Send the response
			response.status(response.statuscode).json(response.content);
			next();
		}
		else if (request.method == 'GET')
		{
			console.log('This is middleware Etag AFTER');

	  		// console.log(response.content);

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
		else if (request.method == "PUT" || request.method == "POST")
		{

			if (request.method == "POST"){
				var id = /.+\/(\d+)/.exec(JSON.stringify(response.content));
				console.log(id);
				request.url = request.url + '/' + id[1];
			}
			var options = {
			  	host: '127.0.0.1',
			  	port: 9000,
			  	path: request.url,
			  	method: 'GET',
			  	headers: {}
			};
			console.log(request.url);

			var req = http.request(options, function(hres) {
				var json = '';
				console.log('STATUS: ' + hres.statusCode);
		  		console.log('HEADERS: ' + JSON.stringify(hres.headers));
		  		hres.setEncoding('utf8');
			    hres.on('data', function (chunk) {
			    	json += chunk;
			    });
			    
			    hres.on('end', function () {
		       		console.log("Got response: " + hres.statusCode);
		       		var jsonRes = '';
		        	// The reponse could be a string
		        	if (json == ''){
						jsonRes = json
		        	}
		        	else{
		        		console.log(json);
		        		jsonRes = JSON.parse(json);
		        	}

		        	// response.status(hres.statusCode).json(jsonRes);
		        	// console.log("GET data: " + jsonRes);
		        	var tableName = response.table;
		        	console.log(jsonRes);
		        	console.log(tableName);
		        	var last_update = jsonRes[tableName][0].last_update;

		        	var str = JSON.stringify(jsonRes);

					var md5 = crypto.createHash('md5');
					var tag = md5.update(str).digest('base64');

					response.setHeader('ETag', tag);
					response.setHeader('Last-Modified', last_update);

					json = {"Etag": tag, "LastModified": last_update};
					var json_str = JSON.stringify(json);
					console.log(json_str);

					client.on("error", function (err) {
			        	console.log("Error " + err);
			    	});

					client.set(request.url, json_str, redis.print);

					// Send the response
					response.status(response.statuscode).json(response.content);

					next();
		       	});

			});

			req.on('error', function(err) {
		  		console.log('problem with request: ' + err.message);
		  		return next(err);
			});
			req.end();
		
		}
		else if (request.method == "DELETE")
		{
			json = {"Etag": '', "LastModified": ''};
			var json_str = JSON.stringify(json);
			console.log(json_str);

			client.on("error", function (err) {
			    console.log("Error " + err);
			});

			client.set(request.url, json_str, redis.print);

			// Send the response
			response.status(response.statuscode).json(response.content);
			
			next();
		}
		else
		{
			// Send the response
			response.status(response.statuscode).json(response.content);
			next();
		}

	});

module.exports = router;