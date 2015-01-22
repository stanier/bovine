var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;
exports.mongoose = mongoose;

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bovinedb';
var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) console.log ('ERROR connecting to: ' + uristring + '. ' + err);
});
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

//= CONFIG OBJECT ===============================================================
//
//   Used for storing server-wide settings and options.  All options are stored
//   in one object, which is identified as a revision based on it's UNIX
//   timestamp
var configSchema = new Schema({
    configured : { type: Boolean, required: false, unique: false },
    public     : { type: Boolean, required: false, unique: false },
    hostname   : { type: String , required: false, unique: false },
    port       : { type: Number , required: false, unique: false },
    codes      : { type: Boolean, required: false, unique: false },
    environment: { type: Number , required: false, unique: false }
});

//= USER OBJECT ================================================================
//
//   Used for basic storage of user info, including credentials and contact info
//   
var userSchema = new Schema({
    username   : { type: String  , required: true , unique: true  },
    email      : { type: String  , required: true , unique: true  },
    password   : { type: String  , required: true , unique: false },
    firstName  : { type: String  , required: false, unique: false },
    middleName : { type: String  , required: false, unique: false },
    lastName   : { type: String  , required: false, unique: false },
    school     : { type: ObjectId, required: false, unique: false },
    role       : { type: Number  , required: true , unique: false },
    grade      : { type: Number  , required: true , unique: false }
});
//= DISTRICT OBJECT ============================================================
//
//   Used mostly for organization of schools.  If location and contact data is
//   not provided for a school, it defaults to it's parent district's info
//   
var districtSchema = new Schema({
    name    : { type: String, required: true , unique: true  },
    website : { type: String, required: false, unique: false },
    zipcode : { type: Number, required: false, unique: false },
    city    : { type: String, required: false, unique: false },
    state   : { type: String, required: false, unique: false },
    country : { type: String, required: false, unique: false },
});
//= SCHOOL OBJECT ==============================================================
//
//   Used mostly for organization of classes and students.  If location and
//   contact data is not provided for a school, it defualts to it's parent
//   district's info
//
var schoolSchema = new Schema({
    name     : { type: String  , required: true , unique: true  },
    type     : { type: String  , required: true , unique: false },
    website  : { type: String  , required: false, unique: false },
    zipcode  : { type: Number  , required: false, unique: false },
    district : { type: ObjectId, required: false, unique: false },
    city     : { type: String  , required: false, unique: false },
    state    : { type: String  , required: false, unique: false },
    country  : { type: String  , required: false, unique: false },
    classes  : { type: ObjectId, required: false, unique: false }
});
//= CLASS OBJECT ===============================================================
//
//   Used for storage of class info
//   
var classSchema = new Schema({
    name     : { type: String  , required: true , unique: true  },
    desc     : { type: String  , required: false, unique: false },
    category : { type: String  , required: false, unique: false },
    website  : { type: String  , required: false, unique: false },
    grade    : { type: Number  , required: false, unique: false },
    school   : { type: ObjectId, required: false, unique: false },
    teacher  : { type: ObjectId, required: false, unique: false },
    enrolled : { type: Array   , required: false, unique: false },
    modules  : { type: Array   , required: false, unique: false }
});
//= MODULE OBJECT ==============================================================
//
//   Object for storing module/lesson details, including a description and
//   any assignments related to the module
var moduleSchema = new Schema({
    name       : { type: String  , required: true , unique: true  },
    desc       : { type: String  , required: false, unique: false },
    class      : { type: ObjectId, required: true , unique: false },
    activities : { type: Array   , required: false, unique: false }
});
//= ASSIGNMENT OBJECT ==========================================================
//
//   Assignment object contains settings and attributes for an assignment that
//   can be served to a student and received as a submission
//   
var assignmentSchema = new Schema({
    name       : { type: String, required: true , unique: false },
    desc       : { type: String, required: false, unique: false },
    type       : { type: String, required: true , unique: false },
    content    : { type: Object, required: false, unique: false },
    timeMax    : { type: Number, required: false, unique: false },
    attemptMax : { type: Number, required: false, unique: false },
    cutoff     : { type: Date  , required: false, unique: false }
});
//= SUBMISSION OBJECT ==========================================================
//
//   Submission object contains submitted assignment data fetched from the
//   appropriate assignment object.  Data is then stored with ID reference to
//   parent assignment, but with no reference to the submission object itself
//   
var submissionSchema = new Schema({
    student    : { type: ObjectId, required: true , unique: false },
    assignment : { type: ObjectId, required: true , unique: false },
    answers    : { type: Array   , required: true , unique: false },
    correct    : { type: Array   , required: false, unique: false },
    time       : { type: Date    , required: false, unique: false },
    duration   : { type: Number  , required: false, unique: false }
})

userSchema.pre('save', function(next) {
	var user = this;
    
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
}

exports.model = {
    user       : mongoose.model('User'      , userSchema       ),
    class      : mongoose.model('Class'     , classSchema      ),
    school     : mongoose.model('School'    , schoolSchema     ),
    module     : mongoose.model('Module'    , moduleSchema     ),
    assignment : mongoose.model('Assignment', assignmentSchema ),
    submission : mongoose.model('Submission', submissionSchema )
}