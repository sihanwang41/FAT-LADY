'use strict';

var express = require('express');
var router = express.Router();

router.use(function(request, response, next){
		console.log('This is middleware BEFORE1');
		next();
	});


module.exports = router;