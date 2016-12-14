(function() {

   var AuthProvider = require('./AuthProvider'),
       GitHub, github;

   GitHub = AuthProvider.extend({

      init: function() {
         this._super('github');
      },

      getAuthLink: function(state) {
         var params;

         params = {
            client_id: 'TODO',
            // TODO: get this from config:
            redirect_uri: 'http://localhost:8080?action=authCompletion&provider=github',
            scope: 'user:email',
            state: state,
         };

         return 'https://github.com/login/oauth/authorize?' + $.param(params);
      },

   });

   github = new GitHub();

   github.run();

}());
