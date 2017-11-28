'use strict';

var ExpressOAuthServer = require('express-oauth-server');
var Request = require('oauth2-server').Request;
var Response = require('oauth2-server').Response;
var express = require('express');
var request = require('supertest');
var sinon = require('sinon');
var should = require('should');

describe('ExpressOAuthServer', function() {
    var app;

    beforeEach(function() {
        app = express();
    });
    
    describe('authenticate()', function() {
        it('should call `authenticate()`', function(done) {
            var oauth = new ExpressOAuthServer({ model: {} });
            sinon.stub(oauth.server, 'authenticate').returns({});
            app.use(oauth.authenticate());

        });
    });
    
});