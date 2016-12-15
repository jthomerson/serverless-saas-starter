(function() {

   module.exports = {
      auth: {
         redirectBase: 'http://localhost:8080',
         // should be the base URL of the API you deployed in auth-api service:
         apiEndpoint: 'https://123abcdef987.execute-api.us-east-1.amazonaws.com/YourUsername',
         google: {
            clientID: 'your-client_id-from-google',
         },
         github: {
            clientID: 'your-client_id-from-github',
         },
      },
   };

}());
