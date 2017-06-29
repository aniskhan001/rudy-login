var bcrypt   = require('bcrypt');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// The Model
var UserSchema = new Schema({
	name: {
		type: String,
		unique: true, // preventing duplicate user
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.pre('save', function (next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) {
					// console.log(err);
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);