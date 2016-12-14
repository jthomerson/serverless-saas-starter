(function() {

   var AuthProvider = require('./AuthProvider'),
       config = require('../../../../client-config'),
       Google, google;

   Google = AuthProvider.extend({

      init: function() {
         this._super('google');
      },

      run: function() {
         gapi.load('auth2', function() {
            var auth2;

            auth2 = gapi.auth2.init({
               client_id: config.auth.google.clientID,
               cookiepolicy: 'single_host_origin',
            });

            this.findButtons().each(function(i, el) {
               auth2.attachClickHandler(el, {}, this._googleSuccess.bind(this), this._googleError.bind(this));
            }.bind(this));
         }.bind(this));
      },

      _googleSuccess: function(gUser) {
         this.handleSuccess(null, gUser.getAuthResponse().id_token);
      },

      _googleError: function(err) {
         // TODO: really handle errors
         console.log('error', err);
      },

   });

   google = new Google();
   google.run();

}());
