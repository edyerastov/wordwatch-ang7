const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/wordwatch-ang7'));

app.post('/api/*', (req, res) => {
  return res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/wordwatch-ang7/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
