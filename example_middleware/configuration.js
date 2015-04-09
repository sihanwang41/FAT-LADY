'use strict';

var express = require('express');
var router = express.Router();

console.log('Getting middleware configuration');

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
AWS.config.logger = console;

var db = new AWS.DynamoDB();
var configuration = function(req, res, next){

var configuration;
var action='put';
if(action){


  var params = {
      KeyConditions: { /* required */
      action: {
        ComparisonOperator: 'EQ', /* required */
        AttributeValueList: [
          { 
              S: action
          }
      ]
    }
  },
  TableName: 'middlewareConfig', /* required */
};
}

// get the configuration
db.query(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred

  else     
  {
      if(data.Count) // returned array > 0
      {

           var before = data.Items[0].before1.L[1]; 
           console.log(before);   }
           configuration = data.Items[0];
           next();

      }
  
});
};

module.exports = router;