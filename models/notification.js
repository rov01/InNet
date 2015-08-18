var db = require('../config/database');
var Schema   = db.Schema;

var NotificationSchema = new Schema({
	env : { type : String , required : true },
	type : { type : String, required : true },
	list : [ { type : String, required : true } ]
})

module.exports = db.model('Notification',NotificationSchema)