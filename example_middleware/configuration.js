'use strict';
var express = require('express');
var router = express.Router();
console.log("Getting middlewareConfig")

router.use(function (req,res,next){
var AWS = require('aws-sdk');
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
           var config = {
            before1:{priority:0,enable:false},
            before2:{priority:0,enable:false},
            service:{priority:0,enable:false},
            after1:{priority:0,enable:false},
            after2:{priority:0,enable:false}
         };

         config.before1.priority = data.Items[0].before1.L[0].N;
         config.before1.enable = data.Items[0].before1.L[1].BOOL;
         config.before2.priority = data.Items[0].before2.L[0].N;
         config.before2.enable = data.Items[0].before2.L[1].BOOL;
         config.service.priority = data.Items[0].service.L[0].N;
         config.service.enable = data.Items[0].service.L[1].BOOL;
         config.after1.priority = data.Items[0].after1.L[0].N;
         config.after1.enable = data.Items[0].after1.L[1].BOOL;
         config.after2.priority = data.Items[0].after2.L[0].N;
         config.after2.enable = data.Items[0].after2.L[1].BOOL;

           req.configuration = config;
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
