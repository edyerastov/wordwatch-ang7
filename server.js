const express = require('express');
const path = require('path');
const HttpsProxyAgent = require('https-proxy-agent');

const proxyConfig = [
  {
    context: '/api',
    pathRewrite: { '^/': '' },
    target: 'http://10.0.0.4',
    changeOrigin: true,
    secure: false
  }
];

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

function setupForCorporateProxy(proxyConfig) {
  if (!Array.isArray(proxyConfig)) {
    proxyConfig = [proxyConfig];
  }

  const proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using corporate proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    proxyConfig.forEach(entry => {
      entry.agent = agent;
    });
  }

  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
