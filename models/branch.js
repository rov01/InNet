/* 
* @Author: roverzon
* @Date:   2015-05-09 20:17:43
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 20:52:26
*/

var db = require('../config/database'),
	Schema   = db.Schema,
	BranchSchema = new Schema({
	id : { type : Number, required : true},
	name  : { type : String, required : true },
	corps : { type : String, required : true },
	director : { type: String},
	directors : [ { type : String } ],
	members : [{  type: Schema.Types.ObjectId , ref: 'Member'}],
	dispatchNum : { type : Number },
	safetyManager : { type : Schema.Types.ObjectId, ref: 'Member'}
})

module.exports = db.model('Branch',BranchSchema)