(function() {
   'use strict';

   var Class = require('class.extend'),
       Util;

   Util = Class.extend({

      getParameterByName: function(name, url) {
         var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
             results;

         if (!url) {
            url = window.location.href;
         }

         results = regex.exec(url);
         name = name.replace(/[\[\]]/g, '\\$&');

         if (!results) {
            return null;
         }

         if (!results[2]) {
            return '';
         }

         return decodeURIComponent(results[2].replace(/\+/g, ' '));
      },

      randomString: function() {
         // TODO: make this better, and likely of variable length
         return Math.random().toString(36).replace(/[^a-z]+/g, '');
      },

   });

   module.exports = new Util();

}());
