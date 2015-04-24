'use strict';

var http = require('http');

var makeRequest = function(options, data, response, next){
	var req = http.request(options, function(hres) {
		var json = '';
		console.log('STATUS: ' + hres.statusCode);
  		console.log('HEADERS: ' + JSON.stringify(hres.headers));
  		hres.setEncoding('utf8');
	    hres.on('data', function (chunk) {
	    	// if (err){
	    	// 	return next(err);
	    	// }
	    	json += chunk;
	        // console.log("body: " + chunk);
	    });
	    
	    hres.on('end', function () {
       		console.log("Got response: " + hres.statusCode);
       		var jsonRes = '';
        	// The reponse could be a string
        	if (json == ''){
				jsonRes = json
        	}
        	else{
        		jsonRes = JSON.parse(json);
        	}

        	// response.status(hres.statusCode).json(jsonRes);
        	
        	response.content = jsonRes;
        	response.statuscode = hres.statusCode;

        	next();
       	});

	});

	// Only when POST and PUT has JSON data
	// console.log(data);
	if (data != null){
		// console.log("writing data\n")
		req.write(data);
	} 
	req.on('error', function(err) {
  		console.log('problem with request: ' + err.message);
  		return next(err);
	});
	req.end();
}

module.exports = makeRequest;