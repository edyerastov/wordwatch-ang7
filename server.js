const express = require('express');
const path = require('path');

const app = express();

app.use(app.router);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));

app.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
  res.setHeader('Last-Modified', new Date().toUTCString());
  next();
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
