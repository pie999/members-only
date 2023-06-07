const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

router.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});
router.post(
  "/sign-up",
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("username is required.")
    .isAlphanumeric()
    .withMessage("username has non-alphanumeric characters."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("password is required.")
    .isAlphanumeric()
    .withMessage("password has non-alphanumeric characters."),
  body("password2")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("passwords do not match"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up-form", { errors: errors.array() });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await user.save();
      res.redirect("/");
    }
  })
);

module.exports = router;
