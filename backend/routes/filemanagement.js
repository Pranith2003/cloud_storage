const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const File = require("../models/file");

router.post("/uploadfile", fetchuser, async (req, res) => {
  const file = await File.create({
    userid: req.user.id,
    title: req.body.title,
  });
  return res.status(200).json({ message: `File Upload path created ${file}` });
});

router.get("/listfiles", async (req, res) => {
  return res.json("List file path created");
});

router.get("/downloadfile", async (req, res) => {
  return res.json("File download path created");
});

router.delete("/deletefile", async (req, res) => {
  return res.json("File delete path created");
});

module.exports = router;
