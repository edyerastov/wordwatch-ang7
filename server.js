const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));
app.use(
  '/api',
  proxy({
    target: 'http://10.0.0.4/',
    changeOrigin: true,
    pathRewrite: { '^/': '' }
  })
);
app.use(cors({ origin: 'https://wordwatch-ang7.herokuapp.com/' }));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);
