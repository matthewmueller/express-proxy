var express = require('express'),
    app = module.exports = express();

app.get('/', function(req, res) {
  res.send('hi from blog!');
});

app.post('/publish', function(req, res) {
  res.send('successfully published');
});
