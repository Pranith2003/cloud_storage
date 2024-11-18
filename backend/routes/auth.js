const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

//Route 1:
router.post(
  "/signup",
  [
    body("name", "Enter name min 3 letters").isLength({ min: 5 }),
    body("email", "give string is not in email format").isEmail(),
    body("password", "shoud contain > 8 letters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        try {
          const { name, email, password } = req.body;
          const isUser = await User.findOne({ email });
          if (isUser) {
            return res.json("Please Try to login user exists");
          }
          const salt = await bcrypt.genSalt(10);
          const secPassword = await bcrypt.hash(password, salt);
          const user = await User.create({
            name,
            email,
            password: secPassword, 
          }); 
          req.session.user = { //session management
            id: user._id,
            name: user.name,
            email: user.email,
          };
          return res
            .status(201)
            .json({ message: `User create successfully!!.., ${user}` });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.log("Server error has coocured!!..");
    }
  }
);

//Route 2:
router.post(
  "/signin",
  [
    body("email", "give string is not in email format").isEmail(),
    body("password", "shoud contain > 8 letters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        try {
          const { email, password } = req.body;
          const isUser = await User.findOne({ email });
          if (isUser) {
            const comparePassword = await bcrypt.compare(
              password,
              isUser.password
            );
            if (comparePassword) {
              req.session.user = {
                id: isUser._id,
                name: isUser.name,
                email: isUser.email,
              };
              return res.status(200).json({
                message: `Welcome!!.. ${isUser.name}`,
              });
            } else {
              return res.status(400).json("Incorrect Password!!..");
            }
          } else {
            return res.status(400).json("Account not found!!..");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error("server error has occured!!..");
    }
  }
);

router.get("/protected", fetchuser, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out." });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully." });
  });
});

module.exports = router;
