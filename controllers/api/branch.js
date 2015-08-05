var router   = require('express').Router();
var Branch   = require('../../models/branch');
var Member  = require('../../models/member');
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


router.get('/', function(req,res){
 	Branch.find({})
 	.sort({id : 1})
 	.exec(function(err,branches){
 		if (err) { 
 			return err
 		}else{
 			res.json(branches)
 		};
 	})
 })

router.put('/',function(req,res){
	Branch.findOneAndUpdate({
		name : req.query.branch
	},
	{
		$set : {
			director : req.body.director
		}
	},
	function(err){
		if (err) {
			return err
		}else{
			res.json({ result  : "modified"})
			socketios.broadcast('onDutyUpdate',{ isUpated : true});
		};
	});
})

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
					return err
				} else{
					res.json(members);
				};
		})
	})
})

router.get('/name/total',function(req,res){
	Branch.findOne({
		name : req.query.branch
	})
	.populate('members')
	.exec(function(err,details){
		if (err) {
			return err
		}else{
			res.json(details)
		}
	})
})

router.get('/:id',function(req,res){
	Branch.findOne({
		_id : req.params.id
	})
	.populate('members')
	.exec(function(err,details){
		if (err) {
			return err
		}else{
			res.json(details)
		}
	})
})

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
			return err
		}else{
			res.json({ result  : " modified"})
		}
	});
})

module.exports = router