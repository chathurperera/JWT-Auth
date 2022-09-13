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

const JWT_SECRET = "sado2o36oe&owhp21678y63248g908O&*@%$^!&@ljio74825d237b@da";

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

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res
      .status(401)
      .json({ status: "Error", error: "Invalid username/password" });
  }

  if (await bycrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );
    return res.status(200).json({ status: "success", data: token });
  }
  res.status(401).json({ status: "error", error: "Invalid username/password" });
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
