"use strict"

var mongoose = require('mongoose');


var visitSchema = new mongoose.Schema({
  landmark: {type: mongoose.Schema.ObjectId, ref: "Landmark"},
  dateVisited: {type: Date, default: new Date()}
})

exports.default = mongoose.model('Visit', visitSchema)
