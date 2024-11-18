const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/cloud_storage";

const mongodb_conn = () => {
  mongoose
    .connect(mongoURL)
    .then(console.log("Connected to DB!!.."))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongodb_conn;
