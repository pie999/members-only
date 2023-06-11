const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});
router.get("/home", (req, res) => {
  res.render("home", { user: req.user });
});
router.get("/log-out", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/home");
  });
});

module.exports = router;
