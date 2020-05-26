The `@bluecanvas/sdk` package contains a simple, convenient, and configurable
HTTP client for making requests to the Blue Canvas REST API. Use it in your app
to call any of the API methods, and let it handle formatting, queuing, retrying,
pagination, and more.

# Installation

```shell
$ npm install @bluecanvas/sdk
```

# Usage

## Initialize the client

The package exports a `Client` class. All you need to do is instantiate it,
and you're ready to go. You'll typically initialize it with your `clientId`
and `clientSecret`, which are used to securely authenticate yourself via
OAuth 2.0. You can find those credentials in your Account Settings
in Blue Canvas.

```javascript
const { Client } = require('@bluecanvas/sdk');

// Read options from environment variables
const clientId = process.env.BLUECANVAS_CLIENT_ID;
const clientSecret = process.env.BLUECANVAS_CLIENT_SECRET;

// Initialize the client
const bluecanvas = new Client({
    clientId,
    clientSecret
});
```

## Call a method

The client instance has a named method for each of the public methods in the
Blue Canvas API. A popular one is called `deployments.putCheck`, and it's used
mark deployment requests with an error, failure, pending, or success state. For
every method, you pass arguments as properties of an options object. This helps
with the readability of your code since every argument has a name. All named
methods return a `Promise` which resolves with the response data or rejects with
an error.

```javascript
(async () => {
    // Creates or updates the status of a check
    // https://docs.bluecanvas.io/reference/checks-api#put-check
    const result = await bluecanvas.deployments.putCheck({
        deploymentNumber: 293,
        name: 'wall-e',
        check: {
          state: 'DONE',
          result: 'SUCCESS',
          description: 'The results are in, everything looks spiffy.'
        }
    });
})();
```

## Handle errors

Errors do happen. In these cases, the returned `Promise` will reject with an
`Error`. You should catch the error and use the information it contains to
decide how your app can proceed.

```javascript
(async () => {
    try {
        const result = await bluecanvas.deployments.putCheck({ ... });
    } catch (e) {
        console.error('Well, that was unexpected.');
    }
})();
```

# Events API

You can quickly set up webhooks and handle notifications from the [Events API](https://docs.bluecanvas.io/reference/events-api) with this SDK. We include a [hapi](https://hapi.dev) plugin for that purpose. To get started, you launch a tiny microservice and register the bundled `EventHandlerPlugin`. The plugin comes with secure defaults and does all the validation and message parsing for you. You just need to handle the message.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/bluecanvas/example-node-eventhandler)

```shell
$ npm install @bluecanvas/sdk
$ npm install hapi
```

```javascript
const Hapi = require('hapi');
const { EventHandlerPlugin } = require('@bluecanvas/sdk');

// Read options from environment variables
const tenantId = process.env.BLUECANVAS_TENANT_ID;

async function main() {
    // Initialize the server and enable error logging
    const server = new Hapi.Server({
        host: '0.0.0.0',
        port: process.env['PORT'] || 3000,
        debug: { request: ['error'] }
    });

    // Declare a message handler function for incoming notifications
    function onNotification(req, h, message) {
        console.log('Got notification from Blue Canvas:', message);

        // Look for specific event types. This one is emitted when a new
        // deployment request is created. You can find other event types
        // in the Events API documentation.
        if (message['Event'] === 'deployments/created') {
            console.log(
                '%s created deployment #%d',
                message['Deployment'].author.email,
                message['Deployment'].deploymentNumber
            );
        }

        return 'ok';
    }

    // Register the Blue Canvas `EventHandlerPlugin` with the server and
    // pass our `tenantId` and `onNotification` handler as options.
    await server.register({
        plugin: EventHandlerPlugin,
        options: {
            tenantId,
            onNotification
        }
    });

    // Ready, set, go!
    await server.start();

    console.log('Server listening on %s and waiting for notifications', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

main();
```

# Requirements

This package supports Node 10.x LTS and higher. It's highly recommended to use
[the latest LTS version of node](https://github.com/nodejs/Release#release-schedule),
and the documentation is written using syntax and features from that version.
