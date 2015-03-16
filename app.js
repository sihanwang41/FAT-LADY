// Loading the express library
var express = require('express');
var app = express();

app.get('/', function(request, response){
	response.send(200);
});

var customers = require('./routes/index');
app.use('/service', customers);



// export the module so that it could be called elsewhere
module.exports = app;