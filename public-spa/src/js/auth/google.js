(function() {

   var AuthProvider = require('./AuthProvider'),
       config = require('../../../../client-config'),
       Google, google;

   Google = AuthProvider.extend({

      init: function() {
         this._super('google');
      },

      getAuthLink: function(state) {
         var params;

         params = {
            client_id: config.auth.google.clientID,
            response_type: 'code',
            scope: 'openid email',
            redirect_uri: this.getRedirectURL(),
            state: state,
         };

         return 'https://accounts.google.com/o/oauth2/v2/auth?' + $.param(params);
      },

   });

   google = new Google();

   google.run();

}());
