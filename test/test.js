'use strict';

var ExpressOAuthServer = require('express-oauth-server');
var Request = require('oauth2-server').Request;
var Response = require('oauth2-server').Response;
var express = require('express');
var bodyparser = require('body-parser');
var request = require('supertest');
var sinon = require('sinon');
var should = require('should');

var InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
var NodeOAuthServer = require('oauth2-server');

describe('ExpressOAuthServer', function() {
    var app;

    beforeEach(function() {
        app = express();
        
        app.use(bodyparser.json());
        app.use(bodyparser.urlencoded({ extended: false }));
    });
    
  describe('authenticate()', function() {
    it('should return an error if "model" is empty', function(done) {
      var oauth = new ExpressOAuthServer({ model: {} });

      app.use(oauth.authenticate());

      request(app.listen())
        .get('/')
        .expect({ error: 'invalid_argument', error_description: 'Invalid argument: model does not implement `getAccessToken()`' })
        .end(done);
    });

    it('should authenticate the request', function(done) {
      var tokenExpires = new Date();
      tokenExpires.setDate(tokenExpires.getDate() + 1);

      //var token = { user: {}, accessTokenExpiresAt: tokenExpires };
      var token = { user: {}, accessTokenExpiresAt: {} };
      var model = {
        getAccessToken: function() {
          return token;
        }
      };
      var oauth = new ExpressOAuthServer({ model: model });

      app.use(oauth.authenticate());

      app.use(function(req, res, next) {
        res.send();

        next();
      });

      request(app.listen())
        .get('/')
        .set('Authorization', 'Bearer foobar')
        .expect(200)
        .end(done);
    });

    it('should cache the authorization token', function(done) {
      var tokenExpires = new Date();
      tokenExpires.setDate(tokenExpires.getDate() + 1);
      var token = { user: {}, accessTokenExpiresAt: tokenExpires };
      var model = {
        getAccessToken: function() {
          return token;
        }
      };
      var oauth = new ExpressOAuthServer({ model: model });

      app.use(oauth.authenticate());
      
      var spy = sinon.spy(function(req, res, next) {
        res.locals.oauth.token.should.equal(token);
        res.send(token);
        next();
      });
      app.use(spy);

      request(app.listen())
        .get('/')
        .set('Authorization', 'Bearer foobar')
        .expect(200, function(err, res){
            spy.called.should.be.True();
            done(err);
        });
    });
  });
    
});