/* 
* @Author: roverzon
* @Date:   2015-04-18 14:54:18
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-07 18:15:07
*/

var express = require('express');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var morgan  = require('morgan');  
var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// JSON API 
app.use('/',				require('./controllers/static'));
app.use('/api/cases',		require('./controllers/api/cases'));
app.use('/api/taskforces',  require('./controllers/api/taskForces'));
app.use('/api/members', 	require('./controllers/api/members'));
app.use('/api/users',   	require('./controllers/api/users'));
app.use('/api/licenses', 	require('./controllers/api/licenses'));
app.use('/api/cars', 		require('./controllers/api/cars'));
app.use('/api/branch', 		require('./controllers/api/branch'));
app.use('/api/strikeTeams', require('./controllers/api/strikeTeams'));
app.use('/api/nfts', 		require('./controllers/api/notifications'))


var server = app.listen(port,function(){
	console.log('server listening on ' +  port)
})

require('./socketios').connect(server);

