var proxy = require('../');
    server = proxy(__dirname);

server.listen(8080, function() {
  console.log('Server started on port 8080');
});
