var router   	= require('express').Router(),
	Branch   	= require('../../models/branch'),
	Member  	= require('../../models/member'),
	StrikeTeam  = require('../../models/strikeTeam'),
	async		= require('async'),
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

router.post('/onduty',function(req,res){
	var branches = [];
	async.waterfall([
    	function(cb){
    		var branches = []; 
    		req.body.forEach(function(branch,i){
				Branch.findOne({
					name : branch
				})
				.exec(function(err,branch){
					Member.populate(branch,
							{path : "members", match : {onDuty : true }},
							function(err, _branch){
								if (err) {
									return err;
								} else {
									branches.push(_branch);
									if (i == req.body.length -1) {
										cb('null',branches);
									};
								};
						});
				});
			});
		}
	],function(err,result){
		if (result) {
			res.json(result);
		};
		if (err) { return err };
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
			directors 	: req.body.directors,
			safetyManager : req.body.safetyManager
		}
	},
	function(err){
		if (err) {
			return err;
		}else{
			return res.send(200)
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
			dispatchNum : req.body.dispatchNum,
			safetyManager : req.body.safetyManager
		}
	},
	function(err){
		if (err) {
			return err;
		} else {
			req.body.members.forEach(function(member){
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						onDuty 	: member.onDuty,
						mission : member.mission,
						group  	: member.group,
						groupId : member.groupId,
						isChecked : member.isChecked 
					}
				},function(err){
					if (err) {return err}
					return 
				})
			});
			return  socketios.broadcast('onDutyUpdate',{ isUpated : true});
		};
	});
});

module.exports = router