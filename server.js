const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const herokuProxy = require('heroku-proxy');

const apiProxy = proxy('/api', {
  target: 'http://52.164.223.244/#',
  changeOrigin: true,
  pathRewrite: { '^/': '' }
});

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

// app.use(apiProxy);

app.use(
  herokuProxy({
    hostname: 'http://10.0.0.4',
    port: 80
  })
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
