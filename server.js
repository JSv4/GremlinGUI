//server.js
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

// HTTPS Redirect for Heroku: https://jaketrent.com/post/https-redirect-node-heroku/
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

// where ever the built package is
const buildFolder = '../build';// load the value in the server

// at runtime
app.set('views', path.join(__dirname, buildFolder));
app.engine('html', require('ejs').renderFile);

app.use(
  '/static',
  express.static(path.join(__dirname, `${buildFolder}/static`)),
);

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));