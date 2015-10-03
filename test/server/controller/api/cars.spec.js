var expect 		= require('chai').expect,
	fs       	= require('fs'),
	path 		= require('path'),
	Car	   		= require('../../../../models/car'),
	api 		= require('../../support/api');

describe('controllers.api.cars', function () {
	var cars,
		targetCorps 	= [ '第一救災救護大隊', '第三救災救護大隊'], 
		targetBranchs 	= [ '蘆洲分隊' ] 

	beforeEach(function (done) {
		Car.remove({},done)
	});

	beforeEach(function (done) {
		var file = path.join(__dirname,'../../../../config/memberDB/vehicleList.json')
		fs.readFile(file, 'utf8', function (err, data) {
			if (err)  throw err ;
			cars = JSON.parse(data);
			Car.create(cars,done);
		});
	});	

	describe('GET /api/cars', function () {
		it('it has 219 vehicles', function(done) {
			api.get('/api/cars')
			.expect(200)
			.expect(function(res){
				expect(res.body).to.have.length(cars.length);
			})
			.end(done)
		});

		it('it matchs the number of cars belonged to the corps', function(done) {
			targetCorps.forEach(function(corps){
				var targetCorpsCars =  cars.filter(function(_car) {
					return _car.corps == corps  
				});
				api.get('/api/cars?corps=' + corps)
				.expect(200)
				.expect(function(res){
					expect(res.body).to.have.length(targetCorpsCars.length);
				})
			});
			done()
		});

		it('it match the number of cars belonged to the branch', function(done) {
			targetBranchs.forEach(function(branch){
				var targetBranchCars =  cars.filter(function(_car) {
					return _car.branch == branch  
				});
				api.get('/api/cars?branch=' + branch)
				.expect(200)
				.expect(function(res){
					expect(res.body).to.have.length(targetBranchCars.length);
				})
			});
			done()
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

	var testCar = {
	  type 		: "測試車輛",
	  corps 	: "第一救災救護大隊",
	  branch 	: "第一救災救護大隊",
	  radioCode	: "第一000",
	  code 		: 000,
	  functions : "測試資料"
	}

	describe('POST /api/cars', function() {
		beforeEach(function (done) {
			api.post('/api/cars')
			.send(testCar)
			.end(done)
		})

		it('it adds a new car', function (done) {
			Car.findOne({
				type : testCar.type
			},function(err,_car){
				if (err) { return err };
				expect(_car).to.have.deep.not.equals(testCar);
				expect(_car.id).to.be.a('number');
				expect(_car.id).to.be.equals(cars.length + 1)
				expect(_car.onDuty).to.be.equals(true)
				expect(_car.isChecked).to.be.equals(false)
				done()
			})
		});
	});

	describe('PUT /api/cars/:id', function() {

		var carId;

		beforeEach(function (done) {
			api.post('/api/cars')
			.send(testCar)
			.expect(200)
			.end(done)
		})

		beforeEach(function (done) {
			Car.findOne({
				radioCode : testCar.radioCode
			},function(err,_car){
				if (err) { return err };
				api.put('/api/cars/' + _car._id )
				.send({
					isChecked : true
				})
				.expect(200)
				.end(done)
			})
		});

		it('it has a car isChecked changed to true', function (done) {
			Car.findOne({
				radioCode : testCar.radioCode 
			},function(err,_car){
				if (err) { return err };
				expect(_car.isChecked).to.be.equals(true)
				done();
			});	
		});	
	});

	afterEach(function (done) {
		Car.remove({},done)
	});
});