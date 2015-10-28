"use strict"

var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  username: {type: String,  required: true},
  fullName: String,
  email: String,
  hash: String,
  salt: String,
  points: {type: Number, default: 0},
  favorites: [{ type: mongoose.Schema.ObjectId, ref: 'Landmark', unique: true}],
  visitedLocations: [{ type: mongoose.Schema.ObjectId, ref: 'Landmark', unique: true}],
  badges: []
})

// unique: true,

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

// User.methods.validateEmail = function(email) {
//   return /(\w+\.)*\w+@(\w+\.)+\w+/.test(email)
// }

module.exports = mongoose.model('User', UserSchema)
