'use strict';
var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

router.use(function (req,res,next){

    AWS.config.loadFromPath('./configAuthConfig.json');
    AWS.config.update({region: 'us-west-2'});
    AWS.config.logger = console;

    var db = new AWS.DynamoDB();
    var action = req.method.toLowerCase();
    if(action){

        //Params for db query
        var params = {
            KeyConditions: { /* required */
                action: {
                    ComparisonOperator: 'EQ', /* required */
                    AttributeValueList: [
                    { 
                    S:action
                    }
                    ]
                }
            },
            TableName: 'middlewareConfig', /* required */
        };
    }   

    // get the configuration
    db.query(params, function (err, data) {
        if(err) console.log(err, err.stack); // an error occurred
        else     
        {
            if(data.Count) // returned array > 0
            {

                var config = {};
                var priority;
                var enable;

                for(var middleware in data.Items[0]){
                    // Do not add action to the configuration list 
                    if(middleware!="action"){
                        
                        // get charactersitics of each middleware
                        var characteristics = data.Items[0][middleware].L;
                        config[middleware] = { priority:characteristics[0].N, enable : characteristics[1].BOOL};
                    }

                }        
                req.configuration = config;
                console.log(config);
                next();

            }

            else
            {
                console.log("Unable to get the middlewareConfig");
            }
        }
    });
});
module.exports = router;
