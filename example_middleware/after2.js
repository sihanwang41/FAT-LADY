'use strict';

var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response, next){
		console.log('This is middleware AFTER2');
		console.log(response.content);
		// response.sendStatus(200);
		next();
	});


module.exports = router;