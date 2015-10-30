"use strict"

var mongoose = require('mongoose');

var landmarkSchema = new mongoose.Schema({
  name: {type: String, required: true},
  location: String,
  yearOfSignificance: Number,
  blurb: String,
  stories: [{type: String}]
})

module.exports = mongoose.model('Landmark', landmarkSchema)
