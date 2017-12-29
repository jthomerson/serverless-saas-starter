'use strict';

var Q = require('q'),
    AWS = require('aws-sdk'),
    docs = new AWS.DynamoDB.DocumentClient(),
    providers = require('./providers/all'),
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

      provider.authorizeLogin(body.accessToken, body.state)
         .then(function(loginInfo) {
            if (!loginInfo) {
               return null;
            }

            return Handler.findOrCreateLogin(loginInfo);
         })
         .then(function(dbLogin) {
            var statusCode = (dbLogin ? 200 : 404),
                body = { error: 'User not authenticated' };

            if (dbLogin) {
               // TODO: return a social authorization object
               body = dbLogin;
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

   findOrCreateLogin: function(loginProviderInfo) {
      var key = loginProviderInfo.provider + ':' + loginProviderInfo.userID,
          table = process.env.SERVERLESS_SERVICE_NAME + '-' + process.env.SERVERLESS_STAGE + '-Logins';

      function createLogin() {
         var params;

         params = {
            TableName: table,
            Item: {
               key: key,
               provider: {
                  type: loginProviderInfo.provider,
                  details: loginProviderInfo,
               },
               // user: null,
            }
         };

         return Q.ninvoke(docs, 'put', params)
            .then(function(resp) {
               console.log('put response', resp);
               return params.Item;
            });
      }

      return Q.ninvoke(docs, 'get', { TableName: table, Key: { key: key } })
         .then(function(resp) {
            console.log('from DB:', resp.Item);
            return resp.Item ? resp.Item : createLogin();
         });
   },

};

module.exports = Handler;
