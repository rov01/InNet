var db = require('../config/database'),
	Schema   = db.Schema,
	GeoLocationSchema = new Schema({
		corps  : { type : String, required : true },
		branch : { type : String, required : true },
		lat    : { type : Number, required : true },
		lng    : { type : Number, required : true },
		address : { type : String, required : true }
	})

module.exports = db.model('Geolocation',GeoLocationSchema)