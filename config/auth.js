'use strict';
let jwt = require('express-jwt');
const constants = require('./constants.js')
var auth = jwt({secret: constants.JWT_SECRET, userProperty: 'payload'});

module.exports = auth;
