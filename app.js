// Loading the express library
var express = require('express');
var app = express();

app.get('/', function(request, response){
	response.send(200);
});

var customers = require('./routes/customers');
app.use('/customers', customers);



// export the module so that it could be called elsewhere
module.exports = app;