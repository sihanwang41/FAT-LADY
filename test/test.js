var request = require('supertest');
var app = require('../app');

// Body-parser
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// Redis connection
var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushall();

describe('Testing on /customers', function(){

	describe('Listing customers on /customers', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "111")
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "112")
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

		var etag;

		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers/600', function(response){
					assert.equal(response.statusCode, 200);
					etag = response.headers['Etag'];
					done();
				})
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "1000");
		});
	
		// Hard to this, have to get the Etag header from the GET above
		it('Returns a 403 status code', function(done){
			request(app)
				.put('/service/customers/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('If-Match', etag)
				.send('{}')
				.set('nonce', "113")
				.expect(403, done);
		});

		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/customers/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.send(data)
				.set('nonce', "114")
				.expect(204, done);
		});

	
		//
		// Return format is different, need to find a way other than hardcode
		//
		 
		// it('Check if customer info is updated', function(done){
		// 	request(app)
		// 		.get('/service/customers/600')
		// 		.expect(JSON.stringify(data), done);
		// });
	
	});
	
	describe('Creating new customers', function(){
	
		it('Returns a 403 status code', function(done){
			request(app)
				.post('/service/customers')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "116")
				.send('{}')
				.expect(403, done);
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "117")
				.expect(404, done);
				
		});
	});
	
	describe('Show customer Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "118")
				.expect(200, done);
				
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "119")
				.expect('Content-Type', /json/, done); // json is the regex
				
		});
	
		it('Returns Customer not found', function(done){
			request(app)
				.get('/service/customers/600000')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "120")
				.expect('"Customer not found"', done); // json is the regex
				
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers?q=\'first_name=MARY\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "121")
				.expect(200, done);
				
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?q=\'first_name=MARY\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "122")
				.expect('Content-Type', /json/, done); // json is the regex
				
		});
	
		//
		// Returns a empty array of customer
		//
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', "199")
				.expect(200, done);
				
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/customers/2?field=\'first_name, last_name\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '124')
				.expect(200, done);
				
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?field=\'first_name, last_name\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '125')
				.expect('Content-Type', /json/, done); // json is the regex
				
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers/2?field=\'first_name, last_name\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '126')
				.expect('Content-Type', /json/, done); // json is the regex
				
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});
/*
	describe('Testing limit and offset on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/customers?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '127')
				.expect(200, done);
				
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/customers?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '128')
				.expect('Content-Type', /json/, done); // json is the regex
				
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});*/
});

describe('Testing on /address', function(){
	describe('Listing customers on /address', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '222')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '223')
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
	
		it('Returns a 403 status code', function(done){
			request(app)
				.put('/service/address/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.send('{}')
				.set('nonce', '224')
				.expect(403, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/address/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '225')
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
	
		it('Returns a 403 status code', function(done){
			request(app)
				.post('/service/address')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '226')
				.send('{}')
				.expect(403, done);
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '227')
				.expect(404, done);
		});
	});
	
	describe('Show address Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '228')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '229')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns Address not found', function(done){
			request(app)
				.get('/service/address/600000')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '230')
				.expect('"Address not found"', done); // json is the regex
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/address?q=\'address=Columbia\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '231')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?q=\'address=Columbia\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '232')
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '233')
				.expect(200, done);
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/address/2?field=\'address, address2\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '234')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?field=\'address, address2\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '235')
				.expect('Content-Type', /json/, done); // json is the regex
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address/2?field=\'address, address2\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '236')
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '237')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/address?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '238')
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '333')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '334')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	});

	describe('Updating existing city', function(){
	
		var data = {
		  	"city" : "Changzhou",
		  	"country_id" : 607
		}
	
		it('Returns a 403 status code', function(done){
			request(app)
				.put('/service/city/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '335')
				.send('{}')
				.expect(403, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/city/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '336')
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
	
		it('Returns a 403 status code', function(done){
			request(app)
				.post('/service/city')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '337')
				.send('{}')
				.expect(403, done);
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '338')
				.expect(404, done);
		});
	});
	
	describe('Show city Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/city/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '339')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '340')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns city not found', function(done){
			request(app)
				.get('/service/city/600000')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '341')
				.expect('"City not found"', done); // json is the regex
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/city?q=\'city=Changzhou\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '342')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city?q=\'city=Changzhou\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '343')
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
				.get('/service/city?field=\'city, city_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '344')
				.expect(200, done);
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/city?field=\'city, city_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '345')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city?field=\'city, city_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '346')
				.expect('Content-Type', /json/, done); // json is the regex
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city?field=\'city, city_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '347')
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
				.get('/service/city?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '348')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/city?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '349')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});
});


describe('Testing on /country', function(){
	describe('Listing countries on /country', function() {
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/country')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '444')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '445')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	});

	describe('Updating existing country', function(){
	
		var data = {
		  	"country" : "China"
		}
	
		it('Returns a 403 status code', function(done){
			request(app)
				.put('/service/country/600')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '446')
				.send('{}')
				.expect(403, done);
		});
	
		it('Returns a 204 status code', function(done){
			request(app)
				.put('/service/country/100')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '447')
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
	
		it('Returns a 403 status code', function(done){
			request(app)
				.post('/service/country')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '448')
				.send('{}')
				.expect(403, done);
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
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '449')
				.expect(404, done);
		});
	});
	
	describe('Show country Info', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/country/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '450')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country/2')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '451')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		it('Returns country not found', function(done){
			request(app)
				.get('/service/country/600000')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '452')
				.expect('"Country not found"', done); // json is the regex
		});
	});


	// Testing for template based query, projection and limit&offset
	describe('Testing queries on GET', function(){
	
		it('Returns 200 status code', function(done){
			request(app)
				.get('/service/country?q=\'country=China\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '453')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country?q=\'country=China\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '454')
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
				.get('/service/country?field=\'country, country_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '455')
				.expect(200, done);
		});

		it('Single: Returns 200 status code', function(done){
			request(app)
				.get('/service/country/2?field=\'country, country_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '456')
				.expect(200, done);
		});
	
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country?field=\'country, country_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '457')
				.expect('Content-Type', /json/, done); // json is the regex
		});

		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country/2?field=\'country, country_id\'')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '458')
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
				.get('/service/country?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '459')
				.expect(200, done);
		});
		it('Returns JSON format', function(done){
			request(app)
				.get('/service/country?&limit=20&offset=30')
				.set('Authorization', 'Basic ZnJlZHJhYmVsbzoxMjM=')//set header for this test
				.set('nonce', '460')
				.expect('Content-Type', /json/, done); // json is the regex
		});
	
		// it('Returns Customer not found', function(done){
		// 	request(app)
		// 		.get('/service/customers/600000')
		// 		.expect('"Customer not found"', done); // json is the regex
		// });
	});
});




