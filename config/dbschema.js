var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;
exports.mongoose = mongoose;

// Database connect
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bovinedb';
var mongoOptions = { db: { safe: true }};

// MongoDB connect
mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    }
});
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

// User info model
var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    middleName: { type: String, required: false },
    lastName: { type: String, required: false },
    school: { type: String, required: false },
    role: { type: Number, required: true },
    grade: { type: Number, required: true },
    enrolled: { type: Array, required: false }
});
// Class info model
var classSchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: false, unique: false },
    website: { type: String, required: false, unique: false },
    grade: { type: Number, required: false, unique: false },
    school: { type: String, required: false, unique: false },
    teacher: { type: String, required: false, unique: false }
});
// School info model
var schoolSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: false },
    website: { type: String, required: false, unique: false },
    zipcode: { type: Number, required: false, unique: false },
    district: { type: String, required: false, unique: false },
    city: { type: String, required: false, unique: false },
    state: { type: String, required: false, unique: false }
});

// Save user
userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Compare password
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

// Export db schema models
exports.model = {
    user: mongoose.model('User', userSchema),
    class: mongoose.model('Class', classSchema),
    school: mongoose.model('School', schoolSchema)
}