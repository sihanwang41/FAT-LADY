var express = require('express');
var router = express.Router();

router.route('/')
	.all(function(request, response, next){
		console.log('This is middleware BEFORE2');
		next();
	});


module.exports = router;