const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const apiProxy = proxy('/api', {
  target: 'https://wordwatch-ang7.herokuapp.com',
  changeOrigin: true,
  pathRewrite: { '^/': '' }
});

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(apiProxy);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
