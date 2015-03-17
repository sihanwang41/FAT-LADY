'use strict';

var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response){
		console.log('This is middleware AFTER2');
		// response.sendStatus(200);
	});


module.exports = router;