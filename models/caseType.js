
var db = require('../config/database'),
	Schema   = db.Schema,
	CaseTypeSchema = new Schema({

	id : { type : Number, required : true},
	type : { type : String, required : true }

})

module.exports = db.model('CaseType',CaseTypeSchema)