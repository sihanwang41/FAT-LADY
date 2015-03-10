var express = require('express');
var app = express();

app.get('/', function(request, response){
	response.send("OK");
});

app.listen(3000, function(){
	console.log("Listening on Port 3000");
});