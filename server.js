  
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI
      || 'mongodb://localhost/budget',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );

  app.use(require("./routes/api"));

  // console.log("URI is ", process.env.MONGODB_URI)
app.listen(PORT, () => {
  console.log(`Now Listening on Port ${PORT}!`);
});