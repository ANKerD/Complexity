const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

const playerRoute = require('./routes/player');
const problemRoute = require('./routes/problem');
const submissionsRoute = require('./routes/submission');

const app = express();
const port = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/player', playerRoute());
app.use('/problem', problemRoute());
app.use('/submission', submissionsRoute());

app.get('/', (req, res) => {
  res.send('TODO: swagger docs');
})

app.listen(port, () => {
  console.log(`Running on port ${port}`);
})