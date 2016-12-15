'use strict';

var Google = require('./providers/Google'),
    GitHub = require('./providers/GitHub'),
    config = require('../server-config.js'),
    google = new Google(config.auth.google),
    github = new GitHub(config.auth.github),
    providers = { google: google, github: github },
    Handler;

require('dotenv').config({ silent: true });

Handler = {

   handler: function(evt, context, cb) {
      var body, headers, data, appName, provider;

      appName = process.env.SERVERLESS_PROJECT;
      appName = appName + ':' + process.env.SERVERLESS_SERVICE_NAME;
      appName = appName + ':' + process.env.SERVERLESS_STAGE;

      headers = {
         'Access-Control-Allow-Origin': '*',
         'X-App': appName,
      };

      try {
         body = JSON.parse(evt.body);
      } catch(ex) {
         console.log('invalid request body', evt.body);
         body = null;
      }

      if (body) {
         provider = providers[body.provider];

         if (!provider) {
            console.log('invalid provider specified in request body:', body.provider, body);
         }
      }

      if (!body || !provider) {
         return cb(null, {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({
               error: 'Invalid request',
            }),
         });
      }

      provider.authorizeUser(body.accessToken, body.state)
         .then(function(user) {
            var statusCode = (user ? 200 : 404),
                body = { error: 'User not authenticated' };

            if (user) {
               // TODO: return a social authorization object
               body = user;
            }

            cb(null, {
               statusCode: statusCode,
               headers: headers,
               body: JSON.stringify(body),
            });
         })
         .fail(function(err) {
            // TODO: better error handling
            console.log('error authenticating user with third-party IdP', err, err.stack);
            cb(err);
         });
   },

};

module.exports = Handler;
