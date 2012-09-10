var express = require('express'),
    app = module.exports = express();

app.get('/', function(req, res) {
  res.send('hi from a!');
});

app.get('/hi', function(req, res) {
  res.send('a says hi!');
});
