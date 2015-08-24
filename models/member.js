/* 
* @Author: roverzon
* @Date:   2015-05-09 20:46:23
* @Last Modified by:   roverzon
* @Last Modified time: 2015-05-09 20:52:04
*/

var db = require('../config/database'),
	Schema = db.Schema,
	memberSchema = Schema({
		title 			: { type : String, required : true  },
		id    			: { type : String },
		name 			: { type : String, required : true  },
		corps 			: { type : String, required : true  },
		branch 			: { type : String, required : true  },
		isChecked		: { type : Boolean, default : false },
		onDuty			: { type : Boolean, default : true  },
		mission			: { type : String },
		missions		: [ { type : String } ],
		radioCodePrefix : { type : String },
		radioCode 		: { type : Number },
		workingTime 	: { type : Number },
		isUser 			: { type : Boolean, default : false }
	})

module.exports = db.model('Member',memberSchema)