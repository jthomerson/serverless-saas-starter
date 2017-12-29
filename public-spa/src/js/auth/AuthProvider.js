(function() {
   'use strict';

   var Class = require('class.extend'),
       config = require('../../../../client-config'),
       util = require('../util');;

   module.exports = Class.extend({

      AUTH_COMPLETION_ACTION: 'authCompletion',

      init: function(providerName) {
         this._provider = providerName;
         this._resetState();
      },

      _resetState: function() {
         return this._state = util.randomString();
      },

      run: function() {
         this._checkForAuthRedirect();
         this.findButtons().click(this.handleButtonClick.bind(this));
      },

      findButtons: function() {
         return $('a[role=' + this._provider + '-signin]');
      },

      getRedirectURL: function() {
         return config.auth.redirectBase + '?action=authCompletion&provider=' + this._provider;
      },

      handleButtonClick: function() {
         var state = this._resetState(),
             url = this.getAuthLink(state);

         console.log('authenticating to [%s] with URL [%s] (state: %s)', this._provider, url, state);

         window.auth = (window.auth || {});
         window.auth[this._provider] = (window.auth[this._provider] || {});
         window.auth[this._provider][state] = this.handleSuccess.bind(this, state);

         window.open(url, '_blank', 'width=400,height=600');
      },

      handleSuccess: function(state, accessToken) {
         var params = { provider: this._provider, accessToken: accessToken, state: state, redirectURL: this.getRedirectURL() },
             url = config.auth.apiEndpoint + '/social-auth';

         console.log('login successful [%s], state: %s, redirect: %s, access code:', this._provider, state, params.redirectURL, accessToken);
         console.log('will post to', url, params);

         $.ajax({ method: 'POST', url: url, data: JSON.stringify(params) })
            .done(function(msg) {
               console.log('done sending social auth to server, response social auth token:', msg);
            });
      },

      _checkForAuthRedirect: function() {
         var state = util.getParameterByName('state'),
             action = util.getParameterByName('action'),
             provider = util.getParameterByName('provider'),
             o = window.opener;

         // TODO: handle error responses
         if (action === this.AUTH_COMPLETION_ACTION && provider === this._provider) {
            console.log('handling auth redirect for provider [%s]:', this._provider, window.location.href);

            if (o && o.auth && o.auth[this._provider] && _.isFunction(o.auth[this._provider][state])) {
               o.auth[this._provider][state](util.getParameterByName('code'));
               window.close();
            } else {
               // TODO: really handle errors
               console.log('error - no handler for [%s:%s:%s]', action, provider, state);
            }
         }
      },

   });

}());
