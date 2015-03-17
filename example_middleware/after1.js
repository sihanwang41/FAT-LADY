'use strict';

var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response){
		console.log('This is middleware AFTER1');
	});


module.exports = router;