var expect 		= require('chai').expect,
	fs       	= require('fs'),
	path 		= require('path'),
	Geolocation = require('../../../../models/geoLocation'),
	api 		= require('../../support/api'); 

describe('controllers.api.geolocations', function () {
	var locations; 
	beforeEach(function (done) {
		Geolocation.remove({},done)
	});

	beforeEach(function (done) {
		var file = path.join(__dirname,'../../../../config/memberDB/locations.json')
		fs.readFile(file, "utf-8", function(err,data){
			if (err)  throw err;
			locations = JSON.parse(data);
			Geolocation.create(locations,done);
		});
	});

	describe('GET /api/geolocations', function() {
		it('has 3 geolocations', function (done) {
			api.get('/api/geolocations')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(15);
			})
			.end(done);
		});

		it('each location has 6 properties', function (done) {
			api.get('/api/geolocations')
			.expect(200)
			.expect(function(res){
				res.body.forEach(function(_location){
					expect(_location).to.have.property('id');
					expect(_location).to.have.property('corps');
					expect(_location).to.have.property('branch');
					expect(_location).to.have.property('lat');
					expect(_location).to.have.property('lng');
					expect(_location).to.have.property('address');
				})
			})
			.end(done)
		});
	});

	describe('GET /api/geolocations&coprs="第三救災救護大隊"', function() {
		it('has 14 geolocations in 第三救災救護大隊 1 in 第一救災救護大隊', function (done) {
			api.get('/api/geolocations?corps=第三救災救護大隊')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(locations.length-1)
			})
			.end(done);
		});
	});

	describe('POST /api/geolocations', function () {
		var geo = {
			id 			: 1,
		  	corps 		: "第三救災救護大隊",  
		  	branch		: "第三救災救護大隊",
		  	lat 		:  25.0927297,
		  	lng 		: 121.4608639,
		  	address 	: "新北市蘆洲區長榮路792號6樓"
		};
		
		beforeEach(function (done) {
			api.post('/api/geolocations')
			.send(locations[0])
			.expect(200)
			.end(done)
		});

		it('added 1 new geolocation data', function (done) {
			Geolocation.findOne({ address : geo.address } ,function(err,geo){
				expect(geo.address).to.deep.equal(geo.address)
				done(err)
			})
		});
	});

	afterEach(function (done) {
		Geolocation.remove({},done)
	});
});

