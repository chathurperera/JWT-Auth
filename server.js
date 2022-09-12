const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
const User = require("./model/users");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static("./public"));

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  if (!username || typeof username !== "string") {
    res.status(500).json({ status: "error", error: "Invalid username!" });
  }
  if (!username || typeof username !== "string") {
    res.status(500).json({ status: "error", error: "Invalid password!" });
  }
  if (plainTextPassword.length < 5) {
    res.status(500).json({
      status: "error",
      error: "Password must be longer than 5 characters!",
    });
  }

  const password = await bycrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    res.status(201).json({ status: "success" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(500)
        .json({ status: "error", error: "User already in use" });
    }
    res.status(500).json({ status: "error", error: error });
  }
});

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
