var router   = require('express').Router(),
	Nft  = require('../../models/notification');

router.get('/',function(req,res){
	Nft.find({},function(err,nfts){
		if (err) {
			return err
		} else {
			res.json(nfts);
		};
	});
});

module.exports = router;
