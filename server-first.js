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

  // app.use(express.static('public'));
  // app.use(express.cookieParser());
  // app.use(express.bodyParser());
  // app.use(express.session({ secret: 'keyboard cat' }));
  // app.use(passport.initialize());
  // app.use(passport.session());
  // app.use(app.router);
  
  
//   var session = require("express-session"),
//     bodyParser = require("body-parser");

// app.use(express.static("public"));
// app.use(session({ secret: "cats" }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(passport.initialize());
// app.use(passport.session());

app.set('port', (process.env.PORT || 8080));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.oauth = new oauthserver({
  model: {}, // See below for specification 
  grants: ['password'],
  debug: true
});
 
// app.all('/oauth/token', app.oauth.grant());
 
app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

app.use(app.oauth.authorize());
app.use(app.oauth.errorHandler());

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
