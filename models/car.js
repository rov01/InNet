var db = require('../config/database'),
Schema   = db.Schema,
CarSchema = new Schema({
	id 			: { type : Number, required : true, default : 0 },
	type 		: { type : String, required : true  },
	corps 	 	: { type : String, required : true  },
	branch 		: { type : String, required : true  },
	corps 		: { type : String, required : true  }, 
	radioCode	: { type : String, required : true  },
	code 		: { type : Number, required : true  },
	functions 	: { type : String },
	isChecked 	: { type : Boolean, default : false },
	onDuty		: { type : Boolean, default : true  },
})

var Car = db.model('Car',CarSchema)

CarSchema.pre('save',function(next){
	var self = this;
	Car.find({})
	.count()
	.exec(function(err,total){
		self.id = total + 1; 
		next();
	});

});

module.exports = Car