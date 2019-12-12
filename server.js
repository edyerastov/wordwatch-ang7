const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');

const apiProxy = proxy('/api', {
  target: 'http://52.164.223.244',
  changeOrigin: true,
  pathRewrite: { '^/': '' }
});

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

app.use(apiProxy);

browserSync.init({
  server: {
    baseDir: './',
    port: 8080,
    middleware: [apiProxy]
  },
  startPath: '/api'
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
