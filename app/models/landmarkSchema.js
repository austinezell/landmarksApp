"use strict"

var mongoose = require('mongoose');

var landmarkSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  wikiLink: String,
  location: String,
  longitude: String,
  latitude: String,
  image: String,
  yearOfSignificance: Number,
  blurb: String,
  stories: [{type: String}],
  registryNumber: Number
})

module.exports = mongoose.model('Landmark', landmarkSchema)
