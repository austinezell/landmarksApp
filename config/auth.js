'use strict';
var jwt = require('express-jwt');
var constants = require('./constants.js');
var auth = jwt({secret: constants.SECRET, userProperty: 'payload'});

module.exports = auth;
