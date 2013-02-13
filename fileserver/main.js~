var http = require('http'),
    assert = require('assert'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');

var port = 5000;
var webPath = 'public';
var mimeTypes = {
  '.js' : 'application/javascript',
  '.html' : 'text/html',
  '.jpeg' : 'image/jpeg',
  '.jpg' : 'image/jpg',
  '.gif' : 'image/gif',
  '.css' : 'text/css'
};

function requestHandler(req, res) {
  var requestedUrl = url.parse(req.url).pathname;
  if(requestedUrl === '/') requestedUrl += 'index.html';
  var requestedFile = path.join(webPath, requestedUrl);
  console.log(req.connection.remoteAddress + ' requested file ' + requestedFile);
  fs.exists(requestedFile, function(exists) {
    if(!exists) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.write('404 Not Found');
      res.end();
      return;
    }
    fs.readFile(requestedFile, 'binary', function(err, file) {
      if(err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.write(err);
        res.end();
        return;
      }
      var type = mimeTypes[path.extname(requestedFile)];
      res.writeHead(200, {
        'Content-Type': type
      });
      res.write(file, 'binary');
      res.end();
    });
  });
}


var server = http.createServer(requestHandler);
server.listen(port, function() { 
  console.log('Listening to the port 5000');  
});

