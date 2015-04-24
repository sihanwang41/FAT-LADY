'use strict';

var os = require('os');
var express = require('express');
var router = express.Router();
var auth;
var username;
var password;

function log(request, response){
	var date = new Date();

	if (request.headers.authorization) {
        auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString().split(':');
    }
	if (auth ) {
		username = auth[0];
		password = auth[1];
	}

	var header2 = request.headers;
	
	//Reformatting the header
	delete header2.authorization;
	header2.date = date;
	header2.username = username;
	header2.method = request.method;
	header2.url = request.url;
	header2.status_code = response.statusCode;
	header2.status_message = response.statusMessage;
	var firstChar = response.statusCode + '';
	firstChar = firstChar.substring(0,1);
	
	if (firstChar == '5'){
		SQSmsg(header2);
		SNSmsg(header2);
	}
	else {
		SQSmsg(header2);
	}
};

function SQSmsg(header2)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = {
  TopicArn : "arn:aws:sns:us-east-1:065434505659:VATopic",
  Message: JSON.stringify(header2)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}

function SNSmsg(header2)
{
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./configLogging.json');

var sns = new AWS.SNS();

var publishParams = { 
  TopicArn : "arn:aws:sns:us-east-1:065434505659:EmailTopic",
  Message: JSON.stringify(header2)
};

sns.publish(publishParams, publishCallback);

function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}
}

module.exports.log = log;
module.exports.SQSmsg = SQSmsg;
module.exports.SNSmsg = SNSmsg;