const express = require("express");
require("dotenv").config();
require("./config/database").connect();
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const isAuth = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("<h1>hello from auth system</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All fields is required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).send("User already exists");
    } else {
      const myEncPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: myEncPassword,
      });

      //token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      //you want to update token or not in db dependents
      //dont send password to the res

      user.password = undefined;

      res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await jwt.sign(
        {
          user_id: user._id,
          email: user.email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res.status(200).cookie("token", token, options).json({
        status: true,
        message: "you are authrized",
        data: user,
      });
    }
    res.status(400).send("Email or Password is incorrect");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", isAuth, async (req, res) => {
  return res.status(200).json({
    status: true,
    message: "welcome to dashboard",
    data: req?.user,
  });
});

module.exports = app;
