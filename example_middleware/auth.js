'use strict';

var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
AWS.config.logger = console;

var db = new AWS.DynamoDB();

router.use(function(req, res, next) {
    var auth;
    var username;
    var password;

    if (res.statuscode == 304 || res.statuscode == 412 || res.statuscode == 403 || res.statuscode == 404 || res.statuscode == 401)
    {
        next();
    }
    // check whether an autorization header was send    
    if (req.headers.authorization) {
    // only accepting basic auth, so:
    // * cut the starting "Basic " from the header
    // * decode the base64 encoded username:password
    // * split the string at the colon
    // -> should result in an array
    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }


    if (auth ) {

        // check if first value matches the expected user on dynamodb aws
        // and if second value matches the expected password on dynamodb aws
        username = auth[0];
        password = auth[1];

        var params = {
            KeyConditions: { 
                user: {
                    ComparisonOperator: 'EQ', 
                    AttributeValueList: [
                    { 
                        S: username
                    }
                    ]
                }
            },
            TableName: 'users', 
            AttributesToGet: [
            'user','password'
            ],
            QueryFilter: {
                password: {
                    ComparisonOperator: 'EQ', 
                    AttributeValueList: [
                    { 
                        S: password
                    }
                    ]
                },
            }
        };

        // Authenticator
        db.query(params, function(err, data) {
            if (err)
            {
            //console.log(err, err.stack); // an error occurred
            console.log("error on authentication")
            console.log("not authorized")
            }	
            else     
            {
                if(data.Count) // returned array > 0
                {
                    console.log("authenticated")
                    console.log("authorized")
                    next();
                }
                else
                {
                    res.statuscode = 401;
                    console.log("Wrong Login/password, not authenticated")
                    console.log("not authorized")
                }
            }
        });

    }
    else
    {
        //next(req);

        console.log("authentication header empty")
        console.log("not authorized")
    }

});

module.exports = router;
