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

describe('Testing on /customers', function(){
	describe('Listing customers on /customers', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers')
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
				.put('/service/customers/600')
				.send('{}')
				.expect(400, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/customers/600')
				.send(data)
				.expect(204, done);
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
				.post('/service/customers')
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
				.delete('/service/customers/60000')
				.expect(404, done);
		});
	});
	
	describe('Show customer Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers/2')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers/2')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns Customer not found', function(done){
			request(app)
				.get('/service/customers/600000')
				.expect('"Customer not found"', done); // json is the regex
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers?q=\'first_name=MARY\'')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?q=\'first_name=MARY\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		/*
		 * Returns a empty array of customer
		*/
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});

	describe('Testing projection on GET', function(){
	
		it('ALL: Returns 200 status code', function(done){
			request(app)
				.get('/service/customers?field=\'first_name, last_name\'')
				.expect(200, done);
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/customers/2?field=\'first_name, last_name\'')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?field=\'first_name, last_name\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers/2?field=\'first_name, last_name\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});

	describe('Testing limit and offset on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers?&limit=20&offset=30')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?&limit=20&offset=30')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});
});


describe('Testing on /address', function(){
	describe('Listing customers on /address', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	});

	describe('Updating existing address', function(){
	
		var data = {
		  	"address" : "Columbia",
		  	"address2" : "New York",
		  	"district": "NY",
		  	"city_id": 500,
		  	"postal_id": "10027",
		  	"phone": "12345678"
		}
	
		it('Returns a 400 status code', function(done){
			request(app)
				.put('/service/address/600')
				.send('{}')
				.expect(400, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/address/600')
				.send(data)
				.expect(204, done);
		});
	
		// it('Check if customer info is updated', function(done){
		// 	request(app)
		// 		.get('/customers/600')
		// 		.expect('store_id', 10, done);
		// });
	
	});
	
	describe('Creating new address', function(){
	
		it('Returns a 400 status code', function(done){
			request(app)
				.post('/service/address')
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

	describe('Deleting address', function(){
		
	
		it('Returns a 404 Status code', function(done){
			request(app)
				.delete('/service/address/60000')
				.expect(404, done);
		});
	});
	
	describe('Show address Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address/2')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address/2')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns Address not found', function(done){
			request(app)
				.get('/service/address/600000')
				.expect('"Address not found"', done); // json is the regex
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address?q=\'address=Columbia\'')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?q=\'address=Columbia\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		/*
		 * Returns a empty array of customer
		*/
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});

	describe('Testing projection on GET', function(){
	
		it('ALL: Returns 200 status code', function(done){
			request(app)
				.get('/service/address?field=\'address, address2\'')
				.expect(200, done);
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/address/2?field=\'address, address2\'')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?field=\'address, address2\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address/2?field=\'address, address2\'')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});

	describe('Testing limit and offset on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address?&limit=20&offset=30')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?&limit=20&offset=30')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});
});


describe('Testing on /city', function(){
	describe('Listing cities on /city', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/city')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	});

	describe('Updating existing city', function(){
	
		var data = {
		  	"city" : "Changzhou",
		  	"country_id" : 607
		}
	
		it('Returns a 400 status code', function(done){
			request(app)
				.put('/service/city/600')
				.send('{}')
				.expect(400, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/city/600')
				.send(data)
				.expect(204, done);
		});
	
		// it('Check if customer info is updated', function(done){
		// 	request(app)
		// 		.get('/customers/600')
		// 		.expect('store_id', 10, done);
		// });
	
	});
	
	describe('Creating new city', function(){
	
		it('Returns a 400 status code', function(done){
			request(app)
				.post('/service/city')
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

	describe('Deleting cities', function(){
		
	
		it('Returns a 404 Status code', function(done){
			request(app)
				.delete('/service/city/60000')
				.expect(404, done);
		});
	});
	
	describe('Show city Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/city/2')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city/2')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns city not found', function(done){
			request(app)
				.get('/service/city/600000')
				.expect('"City not found"', done); // json is the regex
		});
	});
});


describe('Testing on /country', function(){
	describe('Listing countries on /country', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/country')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	});

	describe('Updating existing country', function(){
	
		var data = {
		  	"country" : "China"
		}
	
		it('Returns a 400 status code', function(done){
			request(app)
				.put('/service/country/600')
				.send('{}')
				.expect(400, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/country/100')
				.send(data)
				.expect(204, done);
		});
	
		// it('Check if customer info is updated', function(done){
		// 	request(app)
		// 		.get('/customers/600')
		// 		.expect('store_id', 10, done);
		// });
	
	});
	
	describe('Creating new country', function(){
	
		it('Returns a 400 status code', function(done){
			request(app)
				.post('/service/country')
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

	describe('Deleting country', function(){
		
	
		it('Returns a 404 Status code', function(done){
			request(app)
				.delete('/service/country/60000')
				.expect(404, done);
		});
	});
	
	describe('Show country Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/country/2')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country/2')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns country not found', function(done){
			request(app)
				.get('/service/country/600000')
				.expect('"Country not found"', done); // json is the regex
		});
	});
});









