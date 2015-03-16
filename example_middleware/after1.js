var after1 = function(request, response, next){
	console.log('This is middleware AFTER1');
	next();
}

module.exports = after1;