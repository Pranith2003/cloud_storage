const express = require("express");
const mongodb_conn = require("./config/db");
const app = express();
const cors = require("cors");
const session = require("express-session");
const port = 3000;
require("dotenv").config();

mongodb_conn();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const key = process.env.SESSION_KEY;

app.use(
  session({
    secret: key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }, // Set `secure: true` if using HTTPS
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/file", require("./routes/filemanagement"));
app.use('/api/monitoring', require('./routes/monitoring'));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server is running at port 3000");
});
