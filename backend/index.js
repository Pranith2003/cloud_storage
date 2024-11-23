const express = require("express");
const mongodb_conn = require("./config/db");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const Busboy = require("busboy");

require("dotenv").config();

const app = express();
const port = 3000;

// Database connection
mongodb_conn();

// Middleware setup
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

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
const validateStorage = require("./middleware/storageSelector");
app.use("/api/auth", require("./routes/auth"));
app.use("/api/monitoring", require("./routes/monitoring"));

// File upload route
app.use(
  "/api/file",
  upload.single("file"), // Process the file upload
  validateStorage, // Select storage type based on file size
  require("./routes/filemanagement")
);

app.post("/test-upload", upload.single("file"), (req, res) => {
  const isFile = req.body.fileName;
  console.log("File uploaded:", isFile);
  if (!isFile) {
    return res.status(400).json({ error: "No file provided in the request" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
