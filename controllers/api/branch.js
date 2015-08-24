var router   	= require('express').Router(),
	Branch   	= require('../../models/branch'),
	Member  	= require('../../models/member'),
	socketios 	= require('../../socketios');

router.get('/', function(req,res){
 	Branch.find({ 
 		corps : req.query.corps
 	})
 	.sort({ id : 1 })
 	.exec(function(err,branches){
 		if (err) { 
 			return err;
 		}else{
 			res.json(branches)
 		};
 	});
 });

router.get('/name',function(req,res){
	Branch.findOne({
		name : req.query.branch
	})
	.exec(function(err,details){
		Member
		.populate(details,
			{path : "members", match : {onDuty : true }},
			function(err, members){
				if (err) {
					return err;
				} else {
					res.json(members);
				};
		});
	});
});

router.get('/name/total',function(req,res){
	Branch.findOne({
		name : req.query.branch
	})
	.populate('members')
	.exec(function(err,details){
		if (err) {
			return err;
		} else {
			res.json(details);
		};
	});
});

router.get('/:id',function(req,res){
	Branch.findOne({
		_id : req.params.id
	})
	.populate('members')
	.exec(function(err,details){
		if (err) {
			return err;
		} else {
			res.json(details);
		};
	});
});

router.put('/:branch',function(req,res){
	Branch.findOneAndUpdate({
		name : req.params.branch
	},
	{ 
		$set : {
			members 	: req.body.members,
			director 	: req.body.director,
			directors 	: req.body.directors
		}
	},
	function(err){
		if (err) {
			return err;
		}else{
			res.send(200)
		}
	});
});

router.put('/',function(req,res){
	Branch.findOneAndUpdate({
		name : req.query.branch
	},
	{
		$set : {
			director 	: req.body.director,
			dispatchNum : req.body.dispatchNum
		}
	},
	function(err){
		if (err) {
			return err;
		} else {
			res.send(200);
			socketios.broadcast('onDutyUpdate',{ isUpated : true});
		};
	});
});

module.exports = router