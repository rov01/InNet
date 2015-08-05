var db = require('../config/database');
var Schema   = db.Schema;

var CarSchema = new Schema({
	  type 			: { type : String, required : true  },
	  id 			: { type : String, required : true  },
	  corps 	 	: { type : String, required : true  },
	  branch 		: { type : String, required : true  },
	  radioCode		: { type : String, required : true  },
	  code 			: { type : Number, required : true  },
	  functions 	: { type : String },
	  isChecked 	: { type : Boolean, default : false },
	  onDuty		: { type : Boolean, default : true  },
})

module.exports = db.model('Car',CarSchema)