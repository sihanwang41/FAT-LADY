var http = require('http');

var makeRequest = function(options, data, response){
	var req = http.request(options, function(hres) {
		var json = '';
		console.log('STATUS: ' + hres.statusCode);
  		console.log('HEADERS: ' + JSON.stringify(hres.headers));
  		hres.setEncoding('utf8');
	    hres.on('data', function (chunk) {
	    	json += chunk;
	        console.log("body: " + chunk);
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

        	response.status(hres.statusCode).json(jsonRes);
       	});
	});

	// Only when POST and PUT has JSON data
	console.log(data);
	if (data != null){
		console.log("writing data\n")
		req.write(data);
	} 
	req.on('error', function(e) {
  		console.log('problem with request: ' + e.message);
	});
	req.end();
}

module.exports = makeRequest;