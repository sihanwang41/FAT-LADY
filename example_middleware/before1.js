var before1 = function(request, response, next){
	console.log('This is middleware BEFORE1');
	next();
}

exports.before1 = before1;