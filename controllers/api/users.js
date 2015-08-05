/* 
* @Author: roverzon
* @Date:   2015-05-05 11:45:56
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 10:16:24
*/

var User    = require('../../models/user');
var router  = require('express').Router();
var jwt 	= require('jsonwebtoken');
var bcrypt  = require('bcrypt');
var config  = require('../../config/config');

router.get('/',function(req,res,next){
	if (!req.headers['x-auth']) {
		return res.send(401)
	}
	var auth = jwt.decode(req.headers['x-auth'], config.secret)
	User.findOne({username:auth.username},function(err,user){
		if (err) {return next(err)}
		res.json(user)
	})
})

router.get('/userState',function(req,res){
	User.find({
		online : true
	},
	function(err,users){
		if (err) {
			return err
		} else{
			res.json(users);
		};
	})
})

router.post('/',function(req,res,next){
	var user = new User({
		account	 : req.body.account,
		username : req.body.username,
		password : req.body.password,
		branch	 : req.body.branch,
	})
	bcrypt.hash(req.body.password, 10, function(err,hash){
		if (err) {return next(err)}
		user.password = hash
		user.save(function(err){
			if (err) {return next(err)}
			res.send(201)
		}) 
	})
})

router.post('/authenticate', function(req,res){
	User.findOne({
		account : req.body.account
	},function(err,user){
		if (err) { return err};
		if (!user) {
			res.json({ success : false, message : "Authenticate failed ! User not found"})
		}else if(user){
			bcrypt.compare(req.body.password, user.password, function(err,valid){
				if (err) {
					return  err
				}else{
					if (valid) {
						var token = jwt.sign(user,config.secret,{
							expiresInMinutes:1440
						});
						res.json({
							username : req.body.username,
							success : true,
							token :token 
						});
					}else{
						res.json({success : false, message : "Authenticate failed ! Wrong password"})
					};
				}
			});
		};
	})
})

module.exports = router
