var _ 			= require('lodash'),
	jwt 		= require('jsonwebtoken'),
	socketio 	= require('socket.io'),
	socketioJwt = require('socketio-jwt'),
	User 		= require('./models/user'),
	Member 		= require('./models/member'),
	St 			= require('./models/strikeTeam'),
	config 		= require('./config/config'),
	sockets 	= [];
	
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

		socket.on('createStrikeTeam', function(strikeTeam){
			var newSt = new St({
				id 				: strikeTeam.id, 
				caseId 			: strikeTeam.caseId, 
				branch  		: strikeTeam.branch, 
				director 		: strikeTeam.director, 
				position    	: strikeTeam.position, 
				positions 		: strikeTeam.positions, 
				mission 		: strikeTeam.mission, 
				missions		: strikeTeam.missions,
				area 			: strikeTeam.area,
				areas 			: strikeTeam.areas, 
				floor 			: strikeTeam.floor,
				floors 			: strikeTeam.floors,
				members 		: strikeTeam.members, 
				isDismissed		: strikeTeam.isDismissed, 
				workingTime 	: strikeTeam.workingTime,
				creator 		: strikeTeam.creator 
			});

			newSt.save(function(err,st){
				if (err) {return err};
				Member.populate(st,
					{path : "members", match : {onDuty : true }},
					function(err, st){
						if (err) {
							return err
						} else {
							io.sockets.emit('newSt', st);
						};
				})
			});
		})
	});
}

exports.broadcast = function( topic , data){
	sockets.forEach(function(socket){
		socket.emit(topic, data);
	})
}
