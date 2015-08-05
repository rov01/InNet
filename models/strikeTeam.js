var db = require('../config/database');
var Schema = db.Schema;

var StrikeTeamSchema = Schema({
	id 				: { type : Number},
	caseId 			: { type : String, required : true },
	branch			: { type : String, required : true },
	director 		: { type : String, required : true },
	position    	: { type : String, required : true },
	positions 		: [ { type : String}], 
	mission 		: { type : String, required : true },
	missions		: [{ type : String }],
	area 			: { type : String, required : true},
	areas 			: [{type : String}],
	members 		: [{  type: Schema.Types.ObjectId , ref: 'Member'}],
	isDismissed		: { type : Boolean,  default : false },
	workingTime 	: { type : Number, default : 12000 },
	timeRecord		: [{ type: Date, default: Date.now}],
	state			: { type : String},
	progress 		: { type : Number},
	creator 		: { type : String, required : true },
	timerRunning 	: { type : Boolean, default : false}
})

module.exports = db.model('StrikeTeam',StrikeTeamSchema)