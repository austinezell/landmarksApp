var express = require('express');
var router = express.Router();
var User = require('../models/userSchema.js')
var auth = require('../config/auth.js');


/* GET users listing. */
router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password){
    return res.status(400).send('Username and password are required fields');
  }

  var user = new User()
  user.username= req.body.username;
  user.fullName= req.body.fullName;
  user.email= req.body.email;
  user.setPassword(req.body.password);

  user.save(function(err, data){
    if(err){
      res.status(400).send(err)
    } else {
      var jwt = user.generateJWT()
      res.send(jwt)
    }
  })
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Missing required fields username and password.'});
  }

  User.findOne({username: req.body.username}, function(err, user){
    if(err){
      res.status(402).send(err)
    }else if(!user || !user.validPassword(req.body.password)){
      res.status(401).send('Invalid login credentials')
    }else{
      var jwt = user.generateJWT()
      res.send(jwt)
    }
  })
});

router.post('/favorites/:uid/:lid', auth, function (req, res){
  User.findById(req.params.uid, function (err,user){
    if(err){
      res.send(err)
    }else{
      user.favorites.push(req.params.lid);
      user.save();
      res.send(user)
    }
  })
})

router.post('/visited/:uid/:lid', auth, function (req, res){
  User.findById(req.params.uid, function (err,user){
    if(err){
      res.send(err)
    }else{
      user.visited.push(req.params.lid);
      user.save();
      res.send(user)
    }
  })
})


module.exports = router;
