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
            auth:{priority:0,enable:false},
            Nonce:{priority:0,enable:false},
            loggingBefore:{priority:0,enable:false},
            etagBefore:{priority:0,enable:false},
            service:{priority:0,enable:false},
            loggingAfter:{priority:0,enable:false},
            etagAfter:{priority:0,enable:false}


         };

         config.auth.priority = data.Items[0].auth.L[0].N;
         config.auth.enable = data.Items[0].auth.L[1].BOOL;
         config.Nonce.priority = data.Items[0].Nonce.L[0].N;
         config.Nonce.enable = data.Items[0].Nonce.L[1].BOOL;
         config.loggingBefore.priority = data.Items[0].loggingBefore.L[0].N;
         config.loggingBefore.enable = data.Items[0].loggingBefore.L[1].BOOL;
         config.etagBefore.priority = data.Items[0].etagBefore.L[0].N;
         config.etagBefore.enable = data.Items[0].etagBefore.L[1].BOOL;
         config.service.priority = data.Items[0].service.L[0].N;
         config.service.enable = data.Items[0].service.L[1].BOOL;
         config.loggingAfter.priority = data.Items[0].loggingAfter.L[0].N;
         config.loggingAfter.enable = data.Items[0].loggingAfter.L[1].BOOL;
         config.etagAfter.priority = data.Items[0].etagAfter.L[0].N;
         config.etagAfter.enable = data.Items[0].etagAfter.L[1].BOOL;


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
