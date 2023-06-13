const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

router.get("/message", (req, res) => {
  res.render("message-form");
});

router.post(
  "/message",
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("text is required."),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("message-form", { errors: errors.array() });
    } else {
      const message = new Message({
        text: req.body.text,
        author: req.user._id,
        date: Date.now(),
      });
      await message.save();
      res.redirect("/home");
    }
  })
);

module.exports = router;
