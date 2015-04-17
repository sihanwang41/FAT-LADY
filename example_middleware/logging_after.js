'use strict';

var os = require('os');
var express = require('express');
var router = express.Router();
var auth;
var username;
var password;

router.use(function(request, response, next){
	// Get the current time stamp
	var date = new Date();

	// Getting the authentication (user and pwd) from the header
	if (request.headers.authorization) {
		auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString().split(':');
	}
	if (auth ) {
		username = auth[0];
		password = auth[1];
	}
	
	// Reformatting the header so that it can be logged
	delete request.headers.authorization;
	request.headers.date = date;
	request.headers.username = username;
	request.headers.method = request.method;
	request.headers.url = request.url;
	
	// The header also contains a status code and message because this is after the request is made
	request.headers.status_code = response.statusCode;
	request.headers.status_message = response.statusMessage;
	
	// Get the first character of the status code
	var firstChar = response.statusCode + '';
	firstChar = firstChar.substring(0,1);
	
	// If the request is successful, send SQS message, otherwise send both an SQS and an SNS message
	var success = true;
	if (!success) {
		SQSmsg(request);
		SNSmsg(request);
		return next(new Error('Something blew up in Logging after!!!'));
	}
	// If the first character of the status code is "5," send both SQS and SNS messages
	else if (firstChar == '5'){
		SQSmsg(request);
		SNSmsg(request);
		return next(new Error('Something blew up in the server!!!'));
	}
	else {
		SQSmsg(request);
		next();
	}
});

module.exports = router;

// This function sends an SQS message to the AWS SQS queue
function SQSmsg(request)
{
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('./configLogging.json');
	var sns = new AWS.SNS();
	var publishParams = {
		TopicArn : "arn:aws:sns:us-east-1:065434505659:VATopic",
		Message: " " + JSON.stringify(request.headers)
	};
	sns.publish(publishParams, publishCallback);
	function publishCallback(err, data) {
		console.log("published message");
		console.log(data);
	}
}

// This function sends an SNS message
function SNSmsg(request)
{
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('./configLogging.json');
	var sns = new AWS.SNS();
	var publishParams = { 
		TopicArn : "arn:aws:sns:us-east-1:065434505659:EmailTopic",
		Message: " " + JSON.stringify(request.headers)
	};
	sns.publish(publishParams, publishCallback);
	function publishCallback(err, data) {
		console.log("published message");
		console.log(data);
	}
}
