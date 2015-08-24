/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:10:28
*/

var router 		= require('express').Router(),
	Case 		= require('../../models/case'),
	Car 		= require('../../models/car'),
	Member  	= require('../../models/member'),
	socketios 	= require('../../socketios');

router.post('/',function(req,res){
	var newCase = new Case({
		caseId 			: req.body.caseId,
		address 		: req.body.address,
		officerReceiver : req.body.officerReceiver, 
		type    		: req.body.type,
		phone   		: req.body.phone,
		branches 		: req.body.branches,
		branchIds		: req.body.branchIds,
		cars 			: req.body.cars,
		isOngoing 		: req.body.isOngoing,
		corps 			: req.body.corps,
		env 			: req.body.env,
		floor			: req.body.floor
	});

	newCase.save(function(err, newCase){
		if (err) {
			return err;
		} else {
			Car.populate(newCase,
				{ path : "cars" },
				function(err, newCase){
					if (err) {
						return err
					} else {
						socketios.broadcast('newCase', newCase);
					};
			});
			res.send(201);
		}
	});
})

router.get('/',function(req,res){
	Case.find({
		corps : req.query.corps 
	})
	.sort({ date : -1 })
	.limit(10)
	.exec(function(err, old_case){
		if (err) {
			return err
		} else {
			res.json(old_case);
		}
	});
})

router.get('/branch',function(req,res){
	if (req.query.accessLevel > 1 ) {
		Case.find({
			$and : [ { isOngoing : true} , { corps : req.query.corps } ]
		})
		.sort('-id')
		.limit(3)
		.populate('cars')
		.exec(function(err,old_case){
			res.json(old_case)
		})
	} else {
		Case.find({
			$and : [ { branches : { $in : [req.query.branch] } } , { isOngoing : true}, { corps : req.query.corps } ]
		})
		.sort('-id')
		.limit(3)
		.populate('cars')
		.exec(function(err,old_case){
			res.json(old_case)
		})
	};
})

router.get('/details/:caseId',function(req,res){
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars')
	.populate('branchIds')
	.exec(function(err,old_case){
		if (err) {
			return err
		}else{
			Member
			.populate(old_case,
				{path : "branchIds.members", match : {onDuty : true }},
				function(err, members){
					if (err) {
						return err
					} else{
						res.json(members);
					};
			})
		}
	});
})

router.get('/details',function(req,res){
	Case.find({})
	.populate('cars')
	.exec(function(err,old_case){
		if (err) {
			return err;
		} else{
			res.json(old_case);
		};
	})
})

router.put('/close',function(req,res){
	Case.findOneAndUpdate({
		_id : req.query.id
	},{
		$set : {
			isOngoing : req.body.isOngoing
		}
	},function(err){
		if (err) {
			return err
		}else{
			res.json("case has been closed")
			socketios.broadcast("caseClose",{caseId :req.query.id, isOngoing : false});
		}
		res.send(200);
	});
})

router.get('/:caseId',function(req,res){
	Case.findById({
		_id : req.params.caseId
	})
	.populate('cars')
	.exec(function(err,old_case){
		if (err) {
			return err
		}else{
			res.json(old_case)	
		}
	});
})


router.put('/:caseId',function(req,res){
	Case.findOneAndUpdate({
		_id : req.params.caseId
	},
	{ 
		$set : {
			caseId 			: req.body.caseId,
			address 		: req.body.address,
			officerReceiver : req.body.officerReceiver, 
			type    		: req.body.type,
			phone   		: req.body.phone,
			branches 		: req.body.branches,
			branchIds		: req.body.branchIds,
			cars 			: req.body.cars,
			isOngoing 		: req.body.isOngoing,
			env 			: req.body.env,
			floor			: req.body.floor
		}
	},
	function(err) {
		if (err) { return err };
		socketios.broadcast('caseModified',{ 
		  	caseId 		: req.body.caseId,
			address 		: req.body.address,
			officerReceiver : req.body.officerReceiver, 
			type    		: req.body.type,
			phone   		: req.body.phone,
			branches 		: req.body.branches,
			branchIds		: req.body.branchIds,
			cars 			: req.body.cars,
			isOngoing 		: req.body.isOngoing,
			env 			: req.body.env,
			floor			: req.body.floor
		});
		res.send(200);
	});
});

router.delete('/:caseId',function(req,res){
	Case.remove({
		_id : req.params.caseId
	}, function(err) {
		if (err) {
			return err
		} else {
			res.send(204);
		}
	})
});

module.exports = router