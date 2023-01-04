const express = require('express');
const { isLoggedIn, isLoggedOut } = require('./route-gaurd');
const router = express.Router();


// const { isLoggedIn, isLoggedOut} = require('../middlewares/route-guard');

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("private");
  });

  module.exports = router;