const express = require("express");
const session = require("express-session");

const fetchuser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    return res.status(401).json("Unauthorised access, Please Login!!..");
  }
};

module.exports = fetchuser;
