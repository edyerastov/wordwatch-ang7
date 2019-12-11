const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const apiProxy = proxy('/api', {
  logLevel: 'debug',
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

app.use(
  '/api',
  proxy({
    logLevel: 'debug',
    target: 'http://52.164.223.244',
    changeOrigin: true,
    pathRewrite: { '^/': '' },
    onProxyReq: (proxyReq, req, res) => {
      // Browers may send Origin headers even with same-origin
      // requests. To prevent CORS issues, we have to change
      // the Origin to match the target URL.
      if (proxyReq.getHeader('origin')) {
        proxyReq.setHeader('origin', 'http://52.164.223.244');
      }
    }
  })
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
