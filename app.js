// Loading the express library
var express = require('express');
var app = express();

var customers = require('./routes/customers');
app.use('/customers', customers);



// export the module so that it could be called elsewhere
module.exports = app;