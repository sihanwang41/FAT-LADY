var request = require('supertest');
var app = require('./app');

// Body-parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// Redis connection
var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();


describe('Listing customers on /customers', function() {
	it('Returns 200 status code', function(done){
		request(app)
			.get('/customers')
			.expect(200, done);
	});

	it('Returns JSON format', function(done){
		request(app)
			.get('/customers')
			.expect('Content-Type', /json/, done); // json is the regex
	});
});

describe('Updating existing customer', function(){

	var data = {
	  	"store_id" : 10,
	  	"first_name" : "Jialun",
	  	"last_name" : "Liu",
	  	"email" : "secret@secrete.com",
	  	"address_id" : 100,
	  	"active" : "0"
	}

	it('Returns a 400 status code', function(done){
		request(app)
			.put('/customers/600')
			.send('{}')
			.expect(400, done);
	});

	it('Returns a 204 status code', function(done){
		request(app)
			.put('/customers/600')
			.send(JSON.stringify(data))
			.expect(400, done);
	});

	// it('Check if customer info is updated', function(done){
	// 	request(app)
	// 		.get('/customers/600')
	// 		.expect('store_id', 10, done);
	// });

});

describe('Creating new customers', function(){

	it('Returns a 400 status code', function(done){
		request(app)
			.post('/customers')
			.send('{}')
			.expect(400, done);
	});

	// it('Returns the customer name', function(done){
	// 	request(app)
	// 		.post('/customers')
	// 		.send('name=Bill&description=Billy+brother')
	// 		.expect(/bill/i, done);
	// });

	// it('Validates a new customer name and description', function(done){
	// 	request(app)
	// 		.post('/customers')
	// 		.send('name=&description=')
	// 		.expect(400, done);
	// });
});

describe('Deleting customers', function(){
	

	it('Returns a 404 Status code', function(done){
		request(app)
			.delete('/customers/60000')
			.expect(404, done);
	});
});

describe('Show customer Info', function(){

	it('Returns 200 status code', function(done){
		request(app)
			.get('/customers/2')
			.expect(200, done);
	});

	it('Returns JSON format', function(done){
		request(app)
			.get('/customers/2')
			.expect('Content-Type', /json/, done); // json is the regex
	});

	it('Returns Customer not found', function(done){
		request(app)
			.get('/customers/600000')
			.expect('"Customer not found"', done); // json is the regex
	});
});


