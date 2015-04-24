var redis = require('redis')

var redisClient = redis.createClient()

module.exports = {
	// req : request
	// res : response
	// next : call next middleware

	checkNonce: function(req, res, next) {
		if (res.statuscode == 304 || res.statuscode == 412 || res.statuscode == 403 || res.statuscode == 401)
		{
			next();
		}
		console.log("In Nonce");
		var nonceValue = req.headers['nonce'];
		console.log(nonceValue);
		redisClient.get(nonceValue, function(err, reply){
			console.log('in get function');
			console.log(reply);
			if (!reply) {
				redisClient.set(nonceValue, 1);
				console.log("set success new request");
				next();
			}
			
			else {
				// response.status(403);
				res.statuscode = 403;
				next();
				console.log("drop");
			}
		});
	}
}