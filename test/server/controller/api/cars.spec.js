var expect 		= require('chai').expect,
	fs       	= require('fs'),
	path 		= require('path'),
	Car	   		= require('../../../../models/car'),
	api 		= require('../../support/api');

describe('controllers.api.cars', function () {
	beforeEach(function (done) {
		done()	
	});	

	describe('GET /api/cars', function () {
		it('it has 219 vehicles', function(done) {
			api.get('/api/cars')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(219);
			})
			.end(done)
		});

		it('82 vehicles belong to 第一救災救護大隊', function(done) {
			api.get('/api/cars?corps=第一救災救護大隊')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(82);
			})
			.end(done)
		});

		it('137 vehicles belong to 第三救災救護大隊', function(done) {
			api.get('/api/cars?corps=第三救災救護大隊')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(137);
			})
			.end(done)
		});

		it('13 vehicles belong to 蘆洲分隊', function(done) {
			api.get('/api/cars?branch=蘆洲分隊')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(13);
			})
			.end(done)
		});

		it('it has 219 vehicles on duty', function(done) {
			api.get('/api/cars?onDuty=true')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(219)
			})
			.end(done)
		});
	});


	afterEach(function (done) {
		done()
	});
});