var _ 			= require('lodash');
var config 		= require('./config/config');
var socketio 	= require('socket.io');
var User 		= require('./models/user');
var Member 		= require('./models/member');
var St 			= require('./models/strikeTeam');
var jwt 		= require('jsonwebtoken'); 
var socketioJwt = require('socketio-jwt');
var sockets 	= []

exports.connect = function(server){
	var io = socketio.listen(server);

	io.use(socketioJwt.authorize({
	  secret: config.secret,
	  handshake: true
	}));

	io.on('connection',function(socket){

		sockets.push(socket);
	
		socket.on('disconnect', function(){
			
			_.remove(sockets,socket);

			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : false,
					caseId : null 
				}
			}, function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userDisconnect',{ username : user.username , online : user.online});
						socket.broadcast.emit('userDisconnect',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('login',function(){
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : true
				}
			},function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userLogin',{ username : user.username , online : user.online});
						socket.broadcast.emit('userLogin',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('logout',function(){
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set :{
					online : false
				}
			},function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userLogout',{ username : user.username , online : user.online});
						socket.broadcast.emit('userLogout',{ username : user.username , online : user.online});
						socket.disconnect();
					});
				};
			})
		});

		socket.on('stateUpdate', function(data){
			St.findOneAndUpdate({
				_id : data.id
			},{
				$set : {
					progress : data.progress,
					state 	 : data.progressState
				}
			},function(err){
				if (err) {
					return err
				} else{
					socket.broadcast.emit('progressUpdate', data);
				};
			})
		});

		socket.on('timer',function(st){
			St.findOneAndUpdate(function(){
				_id : st.stId
			},{
				$set :{
					timerRunning : st.timerRunning
				}
			},function(err){
				if (err) {
					return err
				} else{
					socket.broadcast.emit('timerRunning', st);
				};
			})
		})
	});
}

exports.broadcast = function( topic , data){
	sockets.forEach(function(socket){
		socket.emit(topic, data);
	})
}
