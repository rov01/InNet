var db = require('../config/database'),
	Schema   = db.Schema,
	NotificationSchema = new Schema({
		env 	: { type : String, required : true },
		type 	: { type : String, required : true },
		list 	: [ { type : String, required : true } ]
	})

module.exports = db.model('Notification',NotificationSchema)