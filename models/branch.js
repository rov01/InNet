/* 
* @Author: roverzon
* @Date:   2015-05-09 20:17:43
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 20:52:26
*/

var db 				= require('../config/database'),
	Schema   		= db.Schema,
	BranchSchema 	= new Schema({
		id 				: { type : Number, default : 0},
		name  			: { type : String, required : true },
		corps 			: { type : String, required : true },
		director 		: { type : String },
		directors 		: [ { type : String } ],
		members 		: [ {  type: Schema.Types.ObjectId , ref: 'Member'}],
		dispatchNum 	: { type : Number },
		safetyManager 	: { type : String },
		cases 			: [ { type : Schema.Types.ObjectId, ref : 'Case'} ],
		location		: {
			address : { type : String },
			lat 	: { type : Number },
			lng 	: { type : Number }
		}
	});

var Branch = db.model('Branch',BranchSchema)

// BranchSchema.pre('save',function(next){
// 	var self = this;
// 	Branch.find({})
// 	.count()
// 	.exec(function(err,total){
// 		self.id = total + 1; 
// 		next();
// 	});
// });

module.exports = Branch