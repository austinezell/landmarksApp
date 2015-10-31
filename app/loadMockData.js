"use strict"

require('mongoose').connect('mongodb://localhost/bongabonga')
var Landmark = require('./models/landmarkSchema.js')

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./mockData.json', 'utf8'));
obj.forEach(datum => {
  Landmark.create(datum, (err, landmark)=>{
    if(err) {
      console.log("err ", err);
    }else{
      console.log("created ", landmark);
    }
  })
})
