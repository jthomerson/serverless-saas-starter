'use strict';

var Q = require('q'),
    Class = require('class.extend'),
    config = require('../../server-config'),
    request = require('request');

module.exports = Class.extend({

   init: function(config) {
      this._clientID = config.clientID;
      this._secret = config.clientSecret;
   },

   authorizeUser: function(accessToken) {
      // TODO: this is not the best way to do this
      // They recommend using google-auth-library so that the authentication
      // of the token can be done without an additional network request
      return Q.ninvoke(request, 'get', 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken)
         .spread(function(resp, login) {
            var payload = JSON.parse(login),
                gUserID = payload.sub;

            console.log('google login', login);
            console.log('google login payload', payload);

            if (this._clientID !== payload.aud) {
               console.log('client ID in access token payload (%s) does not match our client ID (%s)', payload.aud, this._clientID);
               return null;
            }

            return {
               provider: 'google',
               userID: payload.sub,
               userLogin: payload.email,
               name: payload.name,
               email: payload.email,
               picture: payload.picture,
            };
         }.bind(this));
   },

});
