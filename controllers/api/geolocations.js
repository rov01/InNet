var router   	= require('express').Router(),
	Geolocation = require('../../models/geoLocation')

router.get('/',function(req,res){
	Geolocation
	.find({
		corps : req.query.corps
	})
	.exec(function(err,locations){
		res.json(locations)
	})
})

module.exports = router;