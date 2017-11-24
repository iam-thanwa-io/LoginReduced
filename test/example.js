'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-polyfill");

var OAuth2Server = require('oauth2-server');
var Request = OAuth2Server.Request;
var Response = OAuth2Server.Response;

var model = {
  // We support returning promises.
  getAccessToken: function getAccessToken() {
    return new Promise('works!');
  },

  // Or, calling a Node-style callback.
  getAuthorizationCode: function getAuthorizationCode(done) {
    done(null, 'works!');
  },

  // Or, using generators.
  getClient: /*#__PURE__*/regeneratorRuntime.mark(function getClient() {
    return regeneratorRuntime.wrap(function getClient$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return somethingAsync();

          case 2:
            return _context.abrupt('return', 'works!');

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, getClient, this);
  }),

  // Or, async/wait (using Babel).
  getUser: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return somethingAsync();

            case 2:
              return _context2.abrupt('return', 'works!');

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee, this);
    }));

    function getUser() {
      return _ref.apply(this, arguments);
    }

    return getUser;
  }()
};

var oauth = new OAuth2Server({
  //model: require('./model')
  model: model
});

var request = new Request({
  method: 'GET',
  query: {},
  headers: { Authorization: 'Bearer foobar' }
});

var response = new Response({
  headers: {}
});

var assert = require('assert');
describe('#Test example', function () {
  it('no assert yet', function () {
    oauth.authenticate(request, response).then(function (token) {
      // The request was successfully authenticated.
    }).catch(function (err) {
      // The request failed authentication.
    });

    assert.equal(-1, [1, 2, 3].indexOf(4));
  });
});