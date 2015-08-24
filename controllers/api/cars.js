/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/

var router = require('express').Router(),
	Car = require('../../models/car'); 

router
	// .post('/',function(req,res){
		
	// 	var new_case = new Case({
	// 		case_id 		: req.body.case_id,
	// 		address 		: req.body.address,
	// 		officerReceiver : req.body.officerReceiver, 
	// 		type    		: req.body.type,
	// 		phone   		: req.body.phone,
	// 		branchs 		: req.body.branchs,
	// 		ongoing 		: req.body.ongoing
	// 	});

	// 	new_case.save(function(err){
	// 		if (err) {return err;};
	// 		res.json("Case created");
	// 	});
	// })

router.get('/',function(req,res){
	Car.find({})
	.sort({ id : 1 })
	.exec(function(err, cars){
		if (err) {
			return err
		}else{
			res.json(cars);
		}
	});
})

router.get('/onDuty',function(req,res){
	Car.find({
		onDuty : req.body.condition 
	})
	.sort({ code : 1 })
	.exec(function(err,cars){
		if (err) {
			return err
		}else{
			res.json(cars)
		}
	})
})
	
router.get('/:branch',function(req,res){
	Car.find({
		branch : req.params.branch
	})
	.sort({ code : 1 })
	.exec(function(err,cars){
		if (err) {
			return err
		}else{
			res.json(cars)
		}
	});
})

router.put('/:id',function(req,res){
	Car.findOneAndUpdate({
		_id : req.params.id
	},
	{ 
		$set :{
			isChecked : req.body.isChecked 
		}
	},
	function(err){
		if (err) {
			return err
		}else{
			res.json({ result  : " modified"})
		}
	});
})

module.exports = router