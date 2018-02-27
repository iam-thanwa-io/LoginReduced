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
    
  describe('authorize()', function() {
    it('should cache the authorization code', function(done) {
      var tokenExpires = new Date();
      tokenExpires.setDate(tokenExpires.getDate() + 1);
 
      var code = { authorizationCode: 123 };
      var model = {
        getAccessToken: function() {
          return { user: {}, accessTokenExpiresAt: tokenExpires };
        },
        getClient: function() {
          return { grants: ['authorization_code'], redirectUris: ['http://xxxxx.firebase.com'] }; //TODO -- prepare firebase project
        },
        saveAuthorizationCode: function() {
          return code;
        }
      };
      //Need to consider more options around here 
      var oauth = new ExpressOAuthServer({ model: model, continueMiddleware: true });

      app.use(oauth.authorize());

      var spy = sinon.spy(function(req, res, next) {
        res.locals.oauth.code.should.equal(code);
        next();
      });
      app.use(spy);

      request(app.listen())
        .post('/?state=foobiz')
        .set('Authorization', 'Bearer foobar')
        .send({ client_id: 12345, response_type: 'code' })
        .expect(302, function(err, res){ //TODO - check that should we also return 302 code?? 
            spy.called.should.be.True();
            done(err);
        });
    });

    it('should return an error', function(done) {
      var model = {
        getAccessToken: function() {
          return { user: {}, accessTokenExpiresAt: new Date() };
        },
        getClient: function() {
          return { grants: ['authorization_code'], redirectUris: ['http://example.com'] };
        },
        saveAuthorizationCode: function() {
          return {};
        }
      };
      var oauth = new ExpressOAuthServer({ model: model });

      app.use(oauth.authorize());

      request(app.listen())
        .post('/?state=foobiz')
        .set('Authorization', 'Bearer foobar')
        .send({ client_id: 12345 })
        .expect(400, function(err, res) {
          res.body.error.should.eql('invalid_request');
          res.body.error_description.should.eql('Missing parameter: `response_type`');
          done(err);
        });
    });

    it('should return a `location` header with the code', function(done) {
      var model = {
        getAccessToken: function() {
          return { user: {}, accessTokenExpiresAt: new Date() };
        },
        getClient: function(clientId) {
          return { id: clientId, grants: ['authorization_code'], redirectUris: ['http://example.com'] };
        },
        saveAuthorizationCode: function() {
          return { authorizationCode: 123 };
        }
      };
      var oauth = new ExpressOAuthServer({ model: model });

      app.use(oauth.authorize());

      request(app.listen())
        .post('/?state=foobiz')
        .set('Authorization', 'Bearer foobar')
        .send({ client_id: 12345, response_type: 'code' })
        .expect('Location', 'http://example.com/?code=123&state=foobiz')
        .end(done);
    });

    it('should return an error if `model` is empty', function(done) {
      var oauth = new ExpressOAuthServer({ model: {} });

      app.use(oauth.authorize());

      request(app)
        .post('/')
        .expect({ error: 'invalid_argument', error_description: 'Invalid argument: model does not implement `getClient()`' })
        .end(done);
    });
  });
});