'use strict';
var express = require('express');
var router = express.Router();


router.use(function (req,res,next){

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
AWS.config.logger = console;

var db = new AWS.DynamoDB();
var action='put';
if(action){


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

    console.log("im here in config");
      if(data.Count) // returned array > 0
      {
           req.configuration = data.Items[0];
      }
    }
    });
    next();
});
module.exports = router;
