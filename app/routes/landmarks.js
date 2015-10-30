var express = require('express');
var router = express.Router();
var Landmark = require('../models/uselandmarkSchema.js')


/* GET home page. */
router.get('/add', function(req, res, next) {
  Landmark.create(req.body, (error, landmark)=>{
    if(error) res.send(error)
    else res.send(landmark)
  })
}

module.exports = router
