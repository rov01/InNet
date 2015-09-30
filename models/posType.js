var db = require('../config/database'),
	Schema   = db.Schema,
	PosTypeSchema = new Schema({
		id 			: { type : Number, required : true },
		position 	: { type : String, required : true }
	})
	
module.exports = db.model('PosType',PosTypeSchema)