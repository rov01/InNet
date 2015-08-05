/* 
* @Author: roverzon
* @Date:   2015-04-18 16:01:34
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-21 19:31:58
*/


var express = require('express');
var path = require('path');
var router = express.Router();

router.use(express.static(__dirname + '/../public'));

router.get('/',function(req,res){
	res.sendfile('public/views/index.html')
})

module.exports = router