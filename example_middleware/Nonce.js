var redis = require('redis')

var redisClient = redis.createClient()

module.exports = {
	// req : request
	// res : response
	// next : call next middleware
	checkNonce: function(req, res, next) {
		var nonceValue = req.headers['nonce'];
		
		redisClient.get(nonceValue, function(err, reply){
			if (!reply) {
				redisClient.set(nonceValue, 0)
				console.log("set success new request")
				next()
			}
			
			else {
				res.sendStatus(404)
				console.log("drop")
			}
		)
}