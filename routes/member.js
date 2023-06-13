const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

router.get("/member", (req, res) => {
  res.render("member-form");
});

router.post(
  "/member",
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("passcode is required.")
    .custom((value) => value === "secret")
    .withMessage("passcode is incorrect"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("member-form", { errors: errors.array() });
    } else {
      const user = await User.findById(req.user._id).exec();
      user.isMember = true;
      await user.save();
      res.redirect("/home");
    }
  })
);

module.exports = router;
