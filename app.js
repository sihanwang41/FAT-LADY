// Loading the express library
var express = require('express');
var app = express();

var redis = require('redis');
var client = redis.createClient();

// Now store the API key and API call into the Redis

// GET on '/'
app.get('/', function(request, response){
	response.send("OK");
});

// GET on '/customers'
app.get('/customers', function(request, response){
	response.json("OK");
});

// export the module so that it could be called elsewhere
module.exports = app;