/**
 * Created by HUQ on 11/3/15.
 */
var constants = {
  SECRET: (process.env.SECRET || 'secret'),
  MONGO_URL: (process.env.MONGO_URL || 'mongodb://localhost/landmarks')
}

module.exports = constants;
