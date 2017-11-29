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
            request(app.listen())
                .get('/')
                .end(function() {
                    oauth.server.authenticate.callCount.should.equal(1);
                    oauth.server.authenticate.firstCall.args.should.have.length(3);
                    console.log(oauth.server.authenticate.firstCall.args.length);
                    console.log(oauth.server.authenticate.firstCall.args[3]);
                    // console.log(oauth.server.authenticate.firstCall.args[1]);
                    //console.log(oauth.server.authenticate.firstCall.args[2]);
                    oauth.server.authenticate.firstCall.args[0].should.be.an.instanceOf(Request);
                    oauth.server.authenticate.firstCall.args[1].should.be.an.instanceOf(Response);
                    should.not.exist(oauth.server.authenticate.firstCall.args[2])
                    oauth.server.authenticate.restore();
                
                    done();
                });
        });
    });
    
});