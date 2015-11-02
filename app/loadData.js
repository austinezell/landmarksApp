"use strict"

require('mongoose').connect('mongodb://localhost/landmarks')
var Landmark = require('./models/landmarkSchema.js')

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
obj.landmarks.forEach(item => {
  Landmark.create(item, (err, landmark)=>{
    if(err) {
      console.log("err ", err);
    }else{
      console.log("created ", landmark);
    }
  })
})
