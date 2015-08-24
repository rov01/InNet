var db = require('../config/database'),
	Schema = db.Schema,
	licenseSchema = Schema({
		license_number 	: { type : String},
	    id 				: { type : String},
	  	name			: { type : String},
	  	license			: { type : String},
	    licensing_unit 	: { type : String}
	})

module.exports = db.model('License',licenseSchema)