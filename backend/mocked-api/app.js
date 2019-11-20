require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const playerRoute = require("./routes/playerRoute");
const problemRoute = require("./routes/problemRoute");
const submissionsRoute = require("./routes/submissionRoute");
const blogRoute = require("./routes/blogRoute");
const rankingRoute = require("./routes/rankingRoute");

const app = express();
const port = process.env.PORT;


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  //disables mongoose's buffering mechanism
  bufferCommands: false
};

try {
  mongoose.connect(process.env.MONGO_URL, options);
} catch (error) {
  handleError(error);
}

// Image upload setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb", extended: true }));

app.use("/player", playerRoute());
app.use("/problems", problemRoute());
app.use("/submissions", submissionsRoute());
app.use("/blog", blogRoute());
app.use("/ranking", rankingRoute());

app.get("/", (req, res) => {
  res.send("TODO: swagger docs");
});

app.all("*", (err, req, res, next) =>
  res
    .status(500)
    .send(e)
    .end()
);
app.all("*", (req, res) => res.status(404).send({ message: "Not Found" }));

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
