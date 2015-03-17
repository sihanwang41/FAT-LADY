var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response, next){
		console.log('Fake request processed');
		next();
	});


module.exports = router;