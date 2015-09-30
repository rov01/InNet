/* 
* @Author: roverzon
* @Date:   2015-04-18 14:54:18
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-07 18:15:07
*/

var express = require('express'),
	morgan  = require('morgan'),
	port 	= process.env.PORT || 3000,
	app 	= express();

app.use(morgan('dev'));
app.use(require('./controllers'))

var server = app.listen(port,function(){
	console.log('server listening on ' +  port)
})

require('./socketios').connect(server);

