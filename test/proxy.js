var path = require('path'),
    join = path.join,
    request = require('supertest'),
    express = require('express'),
    expect = require('expect.js'),
    proxy = require('../');

describe('proxy', function() {
  var app;

  beforeEach(function(done) {
    app = proxy(join(__dirname, 'servers'));
    done();
  });

  it('should have a version number', function() {
    expect(proxy.version).to.match(/[0-9]+\.[0-9]+\.[0-9]+/);
  });

  describe('.resolve(...)', function() {
    it('GET / - should resolve to index', function() {
      var path = app.proxy.resolve('/');
      expect(path.route).to.be('index');
      expect(path.path).to.be('/');
    });

    it('GET / should resolve correctly when `this.home` is present', function() {
      app.proxy.home = 'blog';
      var path = app.proxy.resolve('/');
      expect(path.route).to.be('blog');
      expect(path.path).to.be('/');
    });

    it('GET /index.css - should route to /index/index.css', function() {
      var path = app.proxy.resolve('/index.css');
      expect(path.route).to.be('index');
      expect(path.path).to.be('/index.css');
    });

    it('GET /blog/index.css - should route to /blog/index.css', function() {
      var path = app.proxy.resolve('/blog/index.css');
      expect(path.route).to.be('blog');
      expect(path.path).to.be('/index.css');
    });

    it('GET /blog/stuff/index.css - should route to /blog/index.css', function() {
      var path = app.proxy.resolve('/blog/stuff/index.css');
      expect(path.route).to.be('blog');
      expect(path.path).to.be('/stuff/index.css');
    });
  });

  describe('.router(req, res, next)', function() {

    it('GET / - should proxy to index', function(done) {
      request(app)
        .get('/')
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.text).to.be('hi from index!');
          done();
        });
    });

    it('GET /favicon.ico - should proxy to index/favicon.ico', function(done) {
      request(app)
        .get('/favicon.ico')
        .expect('content-type', 'image/x-icon')
        .end(done);
    });

    it('GET /blog - should proxy to `blog` server, route `/`', function(done) {
      request(app)
        .get('/blog')
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.text).to.be('hi from blog!');
          done();
        });
    });

    it('GET /app - should proxy to `app` server, route `/`', function(done) {
      request(app)
        .get('/app')
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.text).to.be('hi from app!');
          done();
        });
    });

    it('GET /app/app.js - should proxy to `app` server, route `/app.js`', function(done) {
      request(app)
        .get('/app/app.js')
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.text).to.be('requested app.js');
          done();
        });
    });

    it('POST /blog/publish - should proxy to `blog` server, route `/publish`', function(done) {
      request(app)
        .post('/blog/publish')
        .end(function(err, res) {
          if(err) return done(err);
          expect(res.text).to.be('successfully published');
          done();
        });
    });

  });
});
