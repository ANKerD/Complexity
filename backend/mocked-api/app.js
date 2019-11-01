var cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const util = require('util')
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const config = require('./config');


const playerRoute = require('./routes/playerRoute');
const problemRoute = require('./routes/problemRoute');
const submissionsRoute = require('./routes/submission');
const blogRoute = require('./routes/blogRoute')

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

// Image upload setup
app.use(fileUpload({
	useTempFiles : true,
	tempFileDir : '/tmp/'
}));
cloudinary.config({

  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

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
