"use strict"
const constants = {
  JWT_SECRET: (process.env.JWT_SECRET || 'secret'),
  MONGO_URL: (process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost/landmarks')
}

module.exports = constants;
