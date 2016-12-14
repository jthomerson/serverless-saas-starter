# Serverless SaaS Starter - Public SPA

This is the single-page app that handles the public portion of your SaaS -
before the user signs in. It contains information that sells the user on
signing up for your service, and handles the login flow.

After login the user will be redirected to the
[application client-side SPA](../app-client/README.md).

## Getting Started

Set up your client configuration:

```
cp ../client-config.example.js ../client-config.js
```

Then edit the config file and insert your auth provider values.

Then you are ready to build the app:

```
grunt build watch
```

Then serve the app from the `dist` directory with something like [http-server].

[http-server]: https://www.npmjs.com/package/http-server
