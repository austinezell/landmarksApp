"use strict"

var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  fullName: String,
  email: String,
  hash: String,
  salt: String,
  points: Number,
  favorites: [{ type: Mongoose.Schema.ObjectId, ref: 'Landmark', unique: true}],
  visitedLocations: [{ type: Mongoose.Schema.ObjectId, ref: 'Landmark', unique: true}],
  badges: []
})


UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('User', UserSchema)
