// const express = require('express')
// const app = express()

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(process.env.PORT, process.env.IP, () => console.log('Starts at ' + process.env.IP + ':' + process.env.PORT))

// app.listen(8080, "0.0.0.0");
// console.log('Starts at 0.0.0.0:8080');

var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');
 
var app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(bodyParser.json());
 
app.oauth = oauthserver({
  model: {}, // See below for specification 
  grants: ['password'],
  debug: true
});
 
app.all('/oauth/token', app.oauth.grant());
 
app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});
 
app.use(app.oauth.errorHandler());
 
app.listen(3000);