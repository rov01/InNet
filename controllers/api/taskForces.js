var TaskForce = require('../../models/taskForce'); 
var Member    = require('../../models/member');
var router = require('express').Router();

router
	.post('/',function(req,res){

		var new_taskForce = new TaskForce({

			id 				: req.body.id,
			caseId 			: req.body.caseId,
			position    	: req.body.position,
			task 			: req.body.task,
			members 		: req.body.members,
			branches		: req.body.branches,
			isDismissed 	: req.body.isDismissed

		});

		new_taskForce.save(function(err){
			if (err) {return err};
			res.json("Task Force created");

		});
	})

	.get('/',function(req,res){

		TaskForce.find()
		.populate('members')
		.exec(function(err, taskForces){

			if (err) {return err};
			res.json(taskForces)
		});
	})

router
	.get('/:caseId',function(req,res){

		TaskForce.find({
			$and : [
				{caseId : req.params.caseId},
				{isDismissed : false}
			]
		})
		.populate('members')
		.exec(function(err,taskForces){
			if (err) {return err};
			res.json(taskForces)
		});
		
	})

	.get('/:caseId/:branchName',function(req,res){
		TaskForce.find({
			$and : [
				{ branches : req.params.branchName},
				{ caseId   : req.params.caseId }
			]
		})
		.populate('members')
		.exec(function(err, total){
			if (err) {throw err};
			res.json(total)
		})
		
	})

	.get('/:caseId/:branchName/count',function(req,res){
		TaskForce.find({
			$and : [
				{ branches : req.params.branchName},
				{ caseId   : req.params.caseId },
				{ isDismissed   : false  }
			]
		})
		.count()
		.exec(function(err, total){
			if (err) {throw err};
			res.json(total)
		})
		
	})

	.get('/:caseId/:position/count',function(req,res){
		TaskForce.find({
			$and : [
				{ position : req.params.position},
				{ caseId   : req.params.caseId },
				{ isDismissed   : false  }
			]
		})
		.count()
		.exec(function(err, total){
			if (err) {throw err};
			res.json(total)
		})
		
	})

	.get('/findById/:taskForceId',function(req,res){
		TaskForce.find({
			_id : req.params.taskForceId
		})
		.populate('members')
		.exec(function(err, taskForce){
			if (err) {throw err};
			res.json(taskForce)
		})
		
	})

	.put('/findById/:taskForceId',function(req,res){

		TaskForce.update({
			_id : req.params.taskForceId
		},
		{ 
			position    	: req.body.position,
			task 			: req.body.task,
			members 		: req.body.members,
			branches		: req.body.branches,
			isDismissed		: req.body.isDismissed
		},
		function(err){
			if (err) {return err};
			res.json("modified")
		});

	})

module.exports = router