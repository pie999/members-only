const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB).catch((err) => console.log(err));

app.use("/", require("./routes/sign-up"));

// error handler (must have 4 arguments for express to consider it as an error handler and not throw an error)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", { err: err });
});

app.listen(3000);
