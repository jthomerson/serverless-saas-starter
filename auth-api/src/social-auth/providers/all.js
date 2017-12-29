'use strict';

var Google = require('./Google'),
    GitHub = require('./GitHub'),
    config = require('../../server-config.js');

module.exports = {
   google: new Google(config.auth.google),
   github: new GitHub(config.auth.github),
};
