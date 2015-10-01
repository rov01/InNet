/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/

var router = require('express').Router(),
	Car = require('../../models/car'); 

router.post('/',function(req,res){
	var Car = new Car({
		type 		: req.body.type,  
		corps 		: req.body.corps,
		branch 		: req.body.branch, 
		radioCode 	: req.body.radioCode,
		code 		: req.body.code,
		functions 	: req.body.functions
	})

	Car.save(function(err,car){
		if (err) {
			return err
		} else {
			return res.status(200).json(car);
		};
	});
})

router.get('/',function(req,res){
	if (req.query.corps) {
		Car.find({
			corps : req.query.corps
		})
		.sort({ id : 1 })
		.exec(function(err, cars){
			if (err) {
				return err
			} else {
				res.json(cars);
			};
		});
	} else if (req.query.branch) {
		Car.find({
			branch : req.query.branch
		})
		.sort({id : 1 })
		.exec(function(err,cars){
			if (err) {
				return err
			} else {
				res.json(cars)
			};
		})
	} else if (req.query.onDuty){

		Car.find({
			onDuty : req.query.onDuty
		})
		.sort({ code : 1 })
		.exec(function(err,cars){
			if (err) {
				return err;
			} else {
				res.json(cars);
			};
		});

	}else {
		Car.find({})
		.sort({ id : 1 })
		.exec(function(err,cars){
			if (err) {
				return err
			} else {
				res.json(cars)
			}
		})
	};


});

router.put('/:id',function(req,res){
	Car.findOneAndUpdate({
		_id : req.params.id
	},
	{ 
		$set : {
			isChecked : req.body.isChecked 
		}
	},
	function(err){
		if (err) {
			return err
		} else {
			res.json(200,{ result  : " modified"});
		};
	});
});

module.exports = router