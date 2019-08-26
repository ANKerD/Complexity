const express = require('express');
const bodyParser = require('body-parser')

const playerRoute = require('./routes/player');
const problemRoute = require('./routes/problem');

const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/player', playerRoute());
app.use('/problem', problemRoute());

app.get('/', (req, res) => {
  res.send('TODO: swagger docs');
})

app.listen(port, () => {
  console.log(`Running on port ${port}`);
})