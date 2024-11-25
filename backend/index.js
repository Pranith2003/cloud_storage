const express = require("express");
const mongodb_conn = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3000;

// Database connection
mongodb_conn();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));

const key = process.env.SESSION_KEY;

app.use(
  session({
    secret: key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // Set `secure: true` if using HTTPS
  })
);

// Multer setup for file uploads
// const upload = multer({
//   dest: "uploads/",
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/monitoring", require("./routes/monitoring"));
app.use("/api/file/", require("./routes/filemanagement"));

// File upload route
// app.use(
//   "/api/file",
//   upload.single("file"), // Process the file upload
//   validateStorage, // Select storage type based on file size
//   require("./routes/filemanagement")
// );

// app.post("/test-upload", upload.single("file"), async (req, res) => {
//   console.log(req);
//   const isFile = await req.file;
//   console.log("File uploaded:", isFile);
//   if (!isFile) {
//     return res.status(400).json({ error: "No file provided in the request" });
//   }
//   res.json({ message: "File uploaded successfully", file: req.file });
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
