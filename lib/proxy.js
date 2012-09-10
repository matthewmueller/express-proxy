/**
 * Module dependencies
 */

var express = require('express'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    url = require('url'),
    parse = url.parse;

/**
 * Cached servers
 */

var servers = {};

/**
 * Proxy server
 */

var Proxy = module.exports = function(options) {
  if(!(this instanceof Proxy)) return new Proxy(options);
  options = options || {};

  if(typeof options === 'string') this.root = options;

  this.root = this.root || options.root,
  this.home = options.home || 'index';

  if(!this.root) throw new Error('Root is required');

  // trim leading /
  this.home = this.home.replace(/^\//, '');

  var app = this.app = express();
  // app.use(express.favicon(this.favicon));

  app.all('*', this.router.bind(this));

  // Save a reference to the proxy object
  app.proxy = this;

  return app;
};

/**
 * Route all traffic through the router
 */

Proxy.prototype.router = function(req, res, next) {
  var url = parse(req.url).pathname,
      path = this.resolve(url),
      server;

  // Rewrite the url
  req.url = path.path;

  try {
    server = require(join(this.root, path.route));
  } catch(err) {
    return next(err);
  }

  return server(req, res, next);
};

Proxy.prototype.resolve = function(path) {
  // Pull the proxy route from the server path
  var parts = path.replace(/^\//, '').split('/'),
      route = parts.shift();

  // Exception: /index.css
  if(!parts.length && extname(route)) {
    return { route : this.home, path : join('/', route) };
  }

  route = (route) ? route : this.home;
  path = join('/', parts.join('/'));

  return { route : route, path : path };
};
