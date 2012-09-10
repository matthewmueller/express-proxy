var express = require('express'),
    app = module.exports = express();

app.get('/', function(req, res) {
  res.send('hi from app!');
});

app.get('/app.js', function(req, res) {
  res.send('requested app.js');
});
