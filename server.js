const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');

const proxy = new httpProxy.RoutingProxy();
const app = express();

function apiProxy(host, port) {
  return function(req, res, next) {
    if (req.url.match(new RegExp('^/api/'))) {
      proxy.proxyRequest(req, res, { host: host, port: port });
    } else {
      next();
    }
  };
}
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

app.configure(function() {
  app.use(express.static(process.cwd() + '/generated'));
  app.use(apiProxy('http://10.0.0.4'));
  app.use(express.bodyParser());
  app.use(express.errorHandler());
});

module.exports = app;

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
