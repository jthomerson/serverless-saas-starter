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

   authorizeLogin: function(accessCode, state, redirectURL) {
      var params;

      params = {
         url: 'https://www.googleapis.com/oauth2/v4/token',
         form: {
            code: accessCode,
            client_id: config.auth.google.clientID,
            client_secret: config.auth.google.clientSecret,
            redirect_uri: redirectURL,
            grant_type: 'authorization_code',
         },
      };

      // console.log('google POST', JSON.stringify(params, null, 3));

      // Step 1: exchange the temporary access code for an access token and ID token
      // (this is step four of https://developers.google.com/identity/protocols/OpenIDConnect)
      // POST https://developers.google.com/identity/protocols/OpenIDConnect
      //    code={codeFromUser}
      //    client_id={clientID}
      //    client_secret={clientSecret}
      //    redirect_uri={redirectURLFromUser}
      //    grant_type=authorization_code
      return Q.ninvoke(request, 'post', params)
         .spread(function(resp, body) {
            var obj;

            console.log('response from google OpenIDConnect:', body);

            try {
               obj = JSON.parse(body);
            } catch(err) {
               console.log('invalid response body', body, err, err.stack);
               return null;
            }

            // TODO: this is not the best way to do this
            // They recommend using google-auth-library so that the authentication
            // of the token can be done without an additional network request
            return Q.ninvoke(request, 'get', 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + obj.id_token);
         })
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
