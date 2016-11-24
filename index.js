const express = require('express'),
      logger = require('morgan');

var app = express();

app.use(logger('dev'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});
