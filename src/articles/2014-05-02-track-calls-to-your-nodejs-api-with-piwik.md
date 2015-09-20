---
layout: post.hbs
lang: en
deck: Piwik Analytics
title: Track calls to your Node.js API with Piwik
intro: >
    When using Piwik for analytics, sometimes you don't want to track only your website’s visitors. Especially as modern web services usually offer RESTful APIs, why not use Piwik to track those requests as well? It really gives you a more accurate view on how users interact with your services: In which ways do your clients use your APIs compared to your website? Which of your services are used the most? And what kind of tools are consuming your API?
date: 2014-05-02
---

*This article was originally written for the [Piwik Analytics Blog](http://piwik.org/blog/).*

With Node.js as your application platform, you can simply use [piwik-tracker](https://github.com/fhemberger/piwik-tracker), a lightweight wrapper for Piwik's own Tracking HTTP API, which helps you getting your API calls into Piwik Analytics.

First, start with installing `piwik-tracker` as a dependency for your project:

```
npm install piwik-tracker --save
```

Then create a new tracking instance with your Piwik URL and the site ID of the project you want to track. As Piwik requires a fully qualified URL for analytics, add it in front of the actual request URL.

```javascript
var PiwikTracker = require('piwik-tracker');

// Initialize with your site ID and Piwik URL
var piwik = new PiwikTracker(1, 'http://mywebsite.com/piwik.php');

// Piwik works with absolute URLs, so you have to provide protocol and hostname
var baseUrl = 'http://example.com';

// Track a request URL: 
piwik.track(baseUrl + req.url);
```


Of cause you can do more than only tracking simple URLs: All parameters offered by [Piwik’s Tracking HTTP API Reference](http://developer.piwik.org/api-reference/tracking-api) are supported, this also includes custom variables. During Piwik API calls, those are referenced as JSON string, so for better readability, you should use `JSON.stringify({})` instead of manual encoding.

```javascript
piwik.track({
    // The full request URL
    url: baseUrl + req.url,

    // This will be shown as title in your Piwik backend
    action_name: 'API call',

    // User agent and language settings of the client
    ua: req.header('User-Agent'),
    lang: req.header('Accept-Language'),

    // Custom request variables
    cvar: JSON.stringify({
        '1': ['API version', 'v1'],
        '2': ['HTTP method', req.method]
    })
});
```

As you can see, you can pass along arbitrary fields of a Node.js [request object](http://nodejs.org/api/http.html#http_http_incomingmessage) like HTTP header fields, status code or request method (GET, POST, PUT, etc.) as well. That should already cover most of your needs.

But so far, all requests have been tracked with the IP/hostname of your Node.js application. If you also want the API user's IP to show up in your analytics data, you have to override Piwik’s default setting, which requires your secret Piwik token:

```javascript
function getRemoteAddr(req) {
    if (req.ip) return req.ip;
    if (req._remoteAddress) return req._remoteAddress;
    var sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    return sock.remoteAddress;
}

piwik.track({
    // …
    token_auth: '<YOUR SECRET API TOKEN>',
    cip: getRemoteAddr(req)
});
```


As we have now collected all the values that we wanted to track, we're basically done. But if you're using Express or restify for your backend, we can still go one step further and put all of this together into a custom middleware, which makes tracking requests even easier.

First we start off with the basic code of our new middleware and save it as `lib/express-piwik-tracker.js`:

```javascript
// ./lib/express-piwik-tracker.js
var PiwikTracker = require('piwik-tracker');

function getRemoteAddr(req) {
    if (req.ip) return req.ip;
    if (req._remoteAddress) return req._remoteAddress;
    var sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    return sock.remoteAddress;
}

exports = module.exports = function analytics(options) {
    var piwik = new PiwikTracker(options.siteId, options.piwikUrl);

    return function track(req, res, next) {
        piwik.track({
            url: options.baseUrl + req.url,
            action_name: 'API call',
            ua: req.header('User-Agent'),
            lang: req.header('Accept-Language'),
            cvar: JSON.stringify({
                '1': ['API version', 'v1'],
                '2': ['HTTP method', req.method]
            }),
            token_auth: options.piwikToken,
            cip: getRemoteAddr(req)

        });
        next();
    }
}
```

Now to use it in our application, we initialize it in our main `app.js` file:

```javascript
// app.js
var express      = require('express'),
    piwikTracker = require('./lib/express-piwik-tracker.js'),
    app          = express();

// This tracks ALL requests to your Express application
app.use(piwikTracker({
    siteId    : 1,
    piwikUrl  : 'http://mywebsite.com/piwik.php',
    baseUrl   : 'http://example.com',
    piwikToken: '<YOUR SECRET API TOKEN>'
}));
```

This will now track each request going to every URL of your API. If you want to limit tracking to a certain path, you can also attach it to a single route instead:

```javascript
var tracker = piwikTracker({
    siteId    : 1,
    piwikUrl  : 'http://mywebsite.com/piwik.php',
    baseUrl   : 'http://example.com',
    piwikToken: '<YOUR SECRET API TOKEN>'
});

router.get('/only/track/me', tracker, function(req, res) {
    // Your code that handles the route and responds to the request
});
```

And that‘s everything you need to track your API users alongside your regular website users.
