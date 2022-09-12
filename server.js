const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("./public"));

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
