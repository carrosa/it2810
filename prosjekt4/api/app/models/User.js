import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

/*
 * Hashes password when user is created or password is modified
 * This is done before the user is saved to the DB, so the plaintext password
 * never touches the DB.
 */

UserSchema.pre('save', function(next) {
  let user = this;
  if (!this.isModified() || !this.isNew) {
    return next();
  }
  bcrypt.hash(user.password, 6, function(err, hash) {
    user.password = hash;
    next();
  })
});

// Compare password and password hash
UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);