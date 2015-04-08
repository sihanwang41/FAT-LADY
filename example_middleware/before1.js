'use strict';

var express = require('express');
var router = express.Router();

router.use(function(request, response, next){
		console.log('This is middleware BEFORE1');
		var success = false;
		if (!success){
			// err.sourceofError = 'BEFORE1';
			return next(new Error('Something blew up!!!'));
		}
		else{
			next();
		}
		// next();
	});


module.exports = router;