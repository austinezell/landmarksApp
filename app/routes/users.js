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

  user.save(function(err, data){
    if(err){
      res.send(err)
    }
    var jwt = user.generateJWT()
    res.send(jwt)
  })
});

router.post('/login', function(req, res, next){
  User.findOne({username: req.body.username}, function(err, user){
    if(err){
      res.send(err)
    }else if(!user || !user.validPassword(req.body.password)){
      res.send('Invalid login credentials')
    }else{
      var jwt = user.generateJWT()
      res.send(jwt)
    }
  })
});

router.post('/favorites/:uid/:lid', function (req, res){
  console.log('here',req.params.uid)
  User.findById(req.params.uid, function (err,user){
    if(err){
      res.send(err)
    }else{
      console.log(req.params.lid)
      user.favorites.push(req.params.lid);
      user.save();
      res.send(user)
    }
  })
})

router.post('/visited/:uid/:lid', function (req, res){
  console.log('here',req.params.uid)
  User.findById(req.params.uid, function (err,user){
    if(err){
      res.send(err)
    }else{
      console.log(req.params.lid)
      user.visited.push(req.params.lid);
      user.save();
      res.send(user)
    }
  })
})


module.exports = router;
