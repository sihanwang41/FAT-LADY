var redis = require('redis')

var redisClient = redis.createClient()

module.exports = {
	// req : request
	// res : response
	// next : call next middleware
	checkNonce: function(req, res, next) {
		console.log("in functionssss");
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
				res.sendStatus(404);
				console.log("drop");
			}
		});
	}
}