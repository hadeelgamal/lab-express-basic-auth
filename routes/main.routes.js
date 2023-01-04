const express = require('express');
const { isLoggedIn, isLoggedOut } = require('./route-gaurd');
const router = express.Router();


// const { isLoggedIn, isLoggedOut} = require('../middlewares/route-guard');

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("main");
  });

  module.exports = router;