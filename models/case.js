/* 
* @Author: roverzon
* @Date:   2015-05-05 09:20:55
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-14 16:09:28
*/

var db = require('../config/database')
var Schema = db.Schema;

var CaseSchema = new Schema({
	caseId   : { type : Number,  required : true, default : 0},
	address   : { type : String,  required : true},
	officerReceiver : { type: String, required : true},
	type      : { type : String,  required : true, default : "火警"},
	phone     : { type : String },
	branches  : [ {type : String , default : "第一救災救護大隊"} ],
	branchIds : [ {  type: Schema.Types.ObjectId , ref: 'Branch'}],
	cars      : [ {  type: Schema.Types.ObjectId , ref: 'Car'} ],
	isOngoing : { type : Boolean},
	date 	  : { type : Date, 	required : true, default : Date.now},
	corps 	  : { type : String }
})

module.exports = db.model('Case',CaseSchema)