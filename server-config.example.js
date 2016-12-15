(function() {

   // TODO: make this merge with client-config so that it's not duplicated
   module.exports = {
      auth: {
         redirectBase: 'http://localhost:8080',
         google: {
            clientID: 'your-client_id-from-google',
            clientSecret: 'your-client_secret-from-google',
         },
         github: {
            clientID: 'your-client_id-from-github',
            clientSecret: 'your-client_secret-from-github',
         },
      },
   };

}());
