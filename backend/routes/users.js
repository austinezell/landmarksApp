var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('../models/userSchema.js')


/* GET users listing. */
router.post('/create', function(req, res, next) {
  console.log("hit", req.body);
  var user = new User()
  user.username= req.body.username;
  user.fullName= req.body.fullName;
  user.email= req.body.email;
  user.setPassword(req.body.password);

  user.save(function(error, data){
    if(error){
      res.send(error)
    }
    res.send(data)
  })
});

router.post('/login', function(req, res, next){

})

module.exports = router;
