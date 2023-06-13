const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/log-in", (req, res) => {
  res.render("log-in-form", { message: req.flash("error") });
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/log-in",
    failureFlash: true,
  })
);

module.exports = router;
