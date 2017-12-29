'use strict';

var Q = require('q'),
    _ = require('underscore'),
    Class = require('class.extend'),
    request = require('request'),
    config = require('../../server-config');

module.exports = Class.extend({

   init: function(config) {
      this._clientID = config.clientID;
      this._secret = config.clientSecret;
   },

   authorizeLogin: function(accessCode, state) {
      var headers = { Accept: 'application/json', 'User-Agent': 'request-Lambda' },
          paramString, url;

      paramString = 'client_id=' + config.auth.github.clientID;
      paramString = paramString + '&client_secret=' + config.auth.github.clientSecret;
      paramString = paramString + '&code=' + accessCode;
      paramString = paramString + '&state=' + state;

      url = 'https://github.com/login/oauth/access_token?' + paramString;

      // Step 1: exchange the temporary access code for an auth token:
      // POST https://github.com/login/oauth/access_token?client_id=foo&client_secret=bar&code={accessCode}&state={state}
      // Accept: application/json
      return Q.ninvoke(request, 'post', { url: url, headers: headers })
         .spread(function(resp, body) {
            // Step 2: Use the access token to access the API
            // GET https://api.github.com/user
            // Authorization: token OAUTH-TOKEN
            var opts = { url: 'https://api.github.com/user' },
                obj;

            try {
               obj = JSON.parse(body);
            } catch(err) {
               console.log('invalid response body', body, err, err.stack);
               return null;
            }

            console.log('step 2 github response', obj);
            opts.headers = _.extend({}, headers, { Authorization: ('token ' + obj.access_token) });

            return Q.ninvoke(request, 'get', opts);
         })
         .spread(function(resp, body) {
            // Step 3: Use the returned information to form our social auth object:
            var user;

            try {
               user = JSON.parse(body);
            } catch(err) {
               console.log('invalid response body', body, err, err.stack);
               return null;
            }

            console.log('step 3 github response', body);

            return {
               provider: 'github',
               userID: user.id,
               userLogin: user.login,
               name: user.name,
               email: user.email,
               picture: user.avatar_url,
            };
         });
   },

});
