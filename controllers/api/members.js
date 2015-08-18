var Member = require('../../models/member'); 
var router = require('express').Router();
var socketios = require('../../socketios');
var jwt  = require('jsonwebtoken');
var config = require('../../config/config');

router.use(function(req,res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.secret, function(err,decoded){
			if (err) {
				return res.json({success:false, message: "Failed to authenticate token."})
			}else{
				console.log(decoded.username + ' received token!');
				req.decoded = decoded;
				next();
			}
		})
	} else {
		return res.status(403).send({
			success : false,
			message : "No token provided"
		})
	}
})

router.post('/',function(req,res){
	var member = new Member({
		title 			: req.body.title,  
		id    			: req.body.id,
		name 			: req.body.name,
		corps 			: req.body.corps,
		branch 			: req.body.branch,
		mission			: req.body.mission,
		missions		: req.body.missions,
		radioCode 		: req.body.radioCode,
		radioCodePrefix : req.body.radioCodePrefix,
		workingTime 	: parseInt(req.body.workingTime)
	});

	member.save(function(err){
		if (err) {return err};
		res.json("New Member created");
	});
})

router.get('/',function(req,res){
	Member.find()
	.sort('-date')
	.exec(function(err, members){
		if (err) {return err};
		res.json(members);
	});
})
	

router.get('/onDuty',function(req,res){
 	Member.find({ $and :[
 		{branch : req.query.branch},
 		{onDuty : true }
 	]})
 	.sort({radioCode : 1})
 	.exec(function(err,members){
 		if (err) {throw err};
 		res.json(members);
 	});
 })
	
router.get('/:branchName', function(req,res){
 	Member.find({ 
 		branch : req.params.branchName
 	})
 	.sort({radioCode : 1 })
 	.exec(function( err, members){
 		if (err) { throw err};
 		res.json(members)
 	})	 
 })

router.get('/findById/:memberId',function(req,res){
	Member.find({
		_id : req.params.memberId
	},function(err,member){
		if (err) {return err}

		res.json(member)
	});
})

router.put('/findById/:memberId',function(req,res){

	Member.findOneAndUpdate({
		_id : req.params.memberId
	},
	{ 
		$set : {
			name  		: req.body.name,
			title  		: req.body.title,
			onDuty 		: req.body.onDuty,
			isChecked 	: req.body.isChecked,
			workingTime : req.body.workingTime,
			radioCode 	: req.body.radioCode,
			branch 		: req.body.branch,
			corps  		: req.body.corps
		}
	},
	function(err){
		if (err) {return err};
		res.json("modified")
	});
})

router.put('/onDuty/findById',function(req,res){
	Member.findOneAndUpdate({
		_id : req.query.memberId
	},{
		$set : {
			mission : req.body.mission,
			onDuty  : req.body.onDuty
		}
	},function(err){
		if (err) { return err } else{
			res.json("update");
		};
	})
})

router.put('/',function(req,res){
	console.log(req.body)
	Member.findOneAndUpdate({
		_id : req.query.id
	},
	{ 
		$set : {
			isChecked : req.body.isChecked,
			mission   : req.body.mission 
		}
		
	},
	function(err){
		if (err) {return err};
		res.json("modified")
	});
})

router.delete('/:memberId',function(req,res){
	Member.findOneAndRemove({
		_id : req.params.memberId
	},function(err){
		if (err) { return err };
	})
})

router.put('/user',function(req,res){
	Member.findOneAndUpdate({
		name : req.query.member
	},{
		$set : {
			isUser : true 
		}
	},function(err){
		if (err) {
			return err
		};
	});
});

router.put('/user/remove',function(req,res){
	
	Member.findOneAndUpdate({
		name : req.query.username
	},{
		$set : {
			isUser : false
		}
	},function(err){
		if (err) {
			return err
		};
	});
});

router.put('/total', function(req,res){
	Member.update({},{isChecked : false},{multi : true }, function(err){
		res.json("modified");
	});
})

module.exports = router;