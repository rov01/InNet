var express = require('express'),
	request = require('supertest'),
	router  = require('../../../controllers');

var app = express()
	app.use(router);
	
module.exports = request(app);