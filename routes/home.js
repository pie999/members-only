const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Message = require("../models/message");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get(
  "/home",
  asyncHandler(async (req, res) => {
    const allMessages = await Message.find().populate("author").exec();
    res.render("home", { user: req.user, messages: allMessages });
  })
);

router.get("/log-out", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/home");
  });
});

module.exports = router;
