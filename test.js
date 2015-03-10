var request = require('supertest');
var app = require('./app');

describe('Request to the root path', function(){
	it('Returns a 200 status code', function(done){
		request(app)
			.get('/')
			.expect(200, done);
	});
});

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

	// it('Returns initial customers', function(done){
	// 	request(app)
	// 		.get('/customers')
	// 		.expect();
	// });
});
