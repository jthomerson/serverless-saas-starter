'use strict';

var Handler;

Handler = {

   handler: function(evt, context, cb) {
      var data, appName;

      data = {
         response: 'pong',
         time: new Date().getTime(),
      };

      appName = process.env.SERVERLESS_PROJECT;
      appName = appName + ':' + process.env.SERVERLESS_SERVICE_NAME;
      appName = appName + ':' + process.env.SERVERLESS_STAGE;

      cb(null, {
         statusCode: 200,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'X-App': appName,
         },
         body: JSON.stringify({
            response: 'pong',
            time: new Date().getTime(),
         }),
      });
   },

};

module.exports = Handler;
