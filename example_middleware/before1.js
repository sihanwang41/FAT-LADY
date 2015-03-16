var before1 = function(request, response, next){
	console.log('This is middleware BEFORE1');
	next();
}

module.exports = before1;