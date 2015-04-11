'use strict';

var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response, next){
		console.log('Fake request processed');
		response.content = "Pass Success!!!!";
		response.sendStatus(200);
		next();
	});

module.exports = router;