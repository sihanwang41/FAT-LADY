'use strict';

var os = require('os');
var express = require('express');
var router = express.Router();
var auth;
var username;
var password;

router.use(function(request, response, next){
	var date = new Date();

	if (request.headers.authorization) {
        auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString().split(':');
    }
	if (auth ) {
		username = auth[0];
		password = auth[1];
	}
	
	var headers2 = request.headers;

	//Reformatting the header

	delete headers2.authorization;
	headers2.date = date;
	headers2.username = username;
	headers2.method = request.method;
	headers2.url = request.url;
	
	SQSmsg(headers2);
	next();

});

module.exports = router;

function SQSmsg(headers2)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = { 
  TopicArn : "arn:aws:sns:us-east-1:065434505659:VATopic",
  Message: JSON.stringify(headers2)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}

function SNSmsg(headers2)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = { 
  TopicArn : "arn:aws:sns:us-east-1:065434505659:EmailTopic",
  Message: JSON.stringify(headers2)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}