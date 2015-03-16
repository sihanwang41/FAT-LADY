var before2 = function(request, response, next){
	console.log('This is middleware BEFORE2');
	next();
}

module.exports = before2;