var router   = require('express').Router();
var Nft  = require('../../models/notification');
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
});

router.get('/',function(req,res){

	Nft.find({},function(err,nfts){
		if (err) {
			return err
		} else {
			res.json(nfts);
		};
	})
});

module.exports = router;
