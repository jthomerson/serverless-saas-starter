(function() {

   var AuthProvider = require('./AuthProvider'),
       config = require('../../../../client-config'),
       GitHub, github;

   GitHub = AuthProvider.extend({

      init: function() {
         this._super('github');
      },

      getAuthLink: function(state) {
         var params;

         params = {
            client_id: config.auth.github.clientID,
            redirect_uri: this.getRedirectURL(),
            scope: 'user:email',
            state: state,
         };

         return 'https://github.com/login/oauth/authorize?' + $.param(params);
      },

   });

   github = new GitHub();

   github.run();

}());
