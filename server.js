var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');

var app = express();

app.set('port', (process.env.PORT || 8080));

app.oauth = new OAuthServer({
  model: require('./model'), // See https://github.com/oauthjs/node-oauth2-server for specification
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());

app.use(function(req, res) {
  res.send('Secret area');
});

app.get('/public', function(req, res) {
  // Does not require an access_token.
  res.send('Public area');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
