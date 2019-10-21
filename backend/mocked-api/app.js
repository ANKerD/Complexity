var cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const util = require('util')

const config = require('./config');

const playerRoute = require('./controllers/player_controller');
const problemRoute = require('./routes/problem');
const submissionsRoute = require('./routes/submission');
const blogRoute = require('./controllers/blog_controller')

const app = express();
const port = config.port;

const username = 'complexity',
      password = 'complexity123',
      db_name = 'complexity',
      db_url = util.format('mongodb+srv://%s:%s@mycluster-7adlt.gcp.mongodb.net/%s?retryWrites=true&w=majority', username, password, db_name);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  //disables mongoose's buffering mechanism
  bufferCommands: false
}

try {
  mongoose.connect(db_url, options);
} catch (error) {
  handleError(error);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/player', playerRoute());
app.use('/problem', problemRoute());
app.use('/submission', submissionsRoute());
app.use('/blog', blogRoute());

app.get('/', (req, res) => {
  res.send('TODO: swagger docs');
})

app.all('*', (req, res) => res.status(404).send({message: 'Not Found'}));


app.listen(port, () => {
  console.log(`Running on port ${port}`);
})
