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
    
      describe('constructor()', function() {
        it('should throw an error if `model` is missing', function() {
            try {
                new ExpressOAuthServer({});
                
                should.fail();
            } catch (e) {
                e.should.be.an.instanceOf(InvalidArgumentError);
                e.message.should.equal('Missing parameter: `model`');
            }
        });
    
        it('should set the `server`', function() {
          var oauth = new ExpressOAuthServer({ model: {} });
    
          oauth.server.should.be.an.instanceOf(NodeOAuthServer);
        });
      });
    
});