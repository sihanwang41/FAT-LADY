// Loading the express library
var express = require('express');
var app = express();

// Redis connection
var redis = require('redis');
var client = redis.createClient();

 // Select different database to run on
client.select((process.env.NODE_ENV || 'development').length);

// Now store the API key and API call into the Redis

// GET on '/'
app.get('/', function(request, response){
	//if (error) throw error;
	response.send("OK");
});

// GET on '/customers'
app.get('/customers', function(request, response){
	//if (error) throw error;
	response.json("OK");
});

app.delete('/customers/:name', function(request, response){
	client.hdel('customers', request.params.name, function(error){
		if (error) throw error;
		response.sendStatus(204);
	});
});

// export the module so that it could be called elsewhere
module.exports = app;