var router 		= require('express').Router(),
	StrikeTeam 	= require('../../models/strikeTeam'),
	Member 		= require('../../models/member'),
	socketios 	= require('../../socketios');

router.post('/',function(req,res){
	var newSt = new StrikeTeam({
		id 				: req.body.id, 
		caseId 			: req.body.caseId, 
		branch  		: req.body.branch, 
		director 		: req.body.director, 
		position    	: req.body.position, 
		positions 		: req.body.positions, 
		mission 		: req.body.mission, 
		missions		: req.body.missions,
		area 			: req.body.area,
		areas 			: req.body.areas, 
		members 		: req.body.members, 
		isDismissed		: req.body.isDismissed, 
		workingTime 	: req.body.workingTime,
		creator 		: req.body.creator 
	}); 
	newSt.save(function(err,st){
		if (err) {return err};
		Member
		.populate(st,
			{path : "members", match : {onDuty : true }},
			function(err, st){
				if (err) {
					return err
				} else{
					res.json(201,{msg : "Strike Team created"});
					// socketios.broadcast('newSt',st);
				};
		})
	});
})

router.put('/dismiss',function(req,res){

	StrikeTeam.findOneAndUpdate({
		_id : req.query.id
	},
	{
		$set :{
			isDismissed : true 
		}
	},function(err){
		if (err) {
			return err
		} else {
			res.json(200,{msg : "strike team is dismissed"});
			socketios.broadcast('dismiss',{stId : req.query.id});
		};
	});
});

router.get('/',function(req,res){
	StrikeTeam.find({
		$and : [
			{ caseId 	  : req.query.caseId },
			{ branch 	  : req.query.branch },
			{ isDismissed : false }
		]
	})
	.populate('members')
	.exec(function(err, st){
		if (err) {
			return err
		} else {
			res.json(st)
		};
	});
});

router.get('/total',function(req,res){
	StrikeTeam.find({
		$and : [
			{ caseId : req.query.caseId},
			{ isDismissed : false}
		]
	})
	.populate('members')
	.exec(function(err, sts){
		if (err) {
			return err
		} else {
			res.json(sts)
		}
	});
});

router.get('/count',function(req,res){
	StrikeTeam.find({
		$and : [
			{ caseId   : req.query.caseId },
			{ isDismissed   : false  }
		]
	})
	.count()
	.exec(function(err, total){
		if (err) { 
			return  err
		}else{
			res.json(total)
		}
	})	
})

router.put('/update',function(req,res){
	StrikeTeam.findOneAndUpdate({
		_id : req.query.id
	},
	{ 
		$push : { 
			members : { $each : req.body.memberIds } 
		},
		$set : {
			position 	: req.body.position,
			area 		: req.body.area,
			mission		: req.body.mission
		}	
	},function(err){
		if (err) {
			return err
		} else {
			res.send(200);
			socketios.broadcast('updateSt',req.body);
		};
	})
})

module.exports = router