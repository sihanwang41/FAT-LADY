'use strict';

var express = require('express');
var router = express.Router();

router.use(function (err, request, response, next) {
  		if(err) console.log('Err:', new Date());

  		res.status(err.statusCode || err.status || 500);
  		res.send({
  		    status:err.statusCode,data: err.message
  		});

  		// next();
	});

module.exports = router;