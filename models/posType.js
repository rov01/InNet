var db = require('../config/database');
var Schema   = db.Schema;

var PosTypeSchema = new Schema({

	id : { type : Number, required : true},
	position : { type : String, required : true }

})

module.exports = db.model('PosType',PosTypeSchema)