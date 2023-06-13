const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const app = express();
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const mongoDB = process.env.MONGO_URL;
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => console.log(err));

app.use("/", require("./routes/sign-up"));
app.use("/", require("./routes/log-in"));
app.use("/", require("./routes/home"));
app.use("/", require("./routes/messageRoute"));
app.use("/", require("./routes/member"));

// error handler (must have 4 arguments for express to consider it as an error handler and not throw an error)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", { err: err });
});

app.listen(3000);
