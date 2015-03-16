var after2 = function(request, response, next){
	console.log('This is middleware AFTER2');
	next();
}

exports.after2 = after2;