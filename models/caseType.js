
var db = require('../config/database');
var Schema   = db.Schema;

var CaseTypeSchema = new Schema({

	id : { type : Number, required : true},
	type : { type : String, required : true }

})

module.exports = db.model('CaseType',CaseTypeSchema)