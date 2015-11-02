"use strict"

let express = require('express');
let router = express.Router();
let Landmark = require('../models/landmarkSchema.js')


router.get('/', (req, res, next) => {
  console.log('hit');
  Landmark.find({}, (err, landmarks)=>{
    if(err) res.send(err)
    else res.send(landmarks)
  })
});

module.exports = router;
