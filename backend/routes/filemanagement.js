// routes/filemanagement.js
const express = require("express");
const multer = require("multer");
const fetchUser = require("../middleware/fetchuser");
const { storageSelector, filetype } = require("../middleware/storageSelector");
const s3Service = require("../services/s3");
const hdfsService = require("../services/hdfs");
const mongoService = require("../services/mongo");
const File = require("../models/file");
const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  [fetchUser, upload.single("file"), storageSelector],
  async (req, res) => {
    const { selectedStorage } = req; // The storage backend selected by storageSelector.js
    // console.log(req.body);
    const {
      fieldname,
      originalname,
      encoding,
      mimetype,
      destination,
      filename,
      path,
      size,
    } = req.file;
    // console.log("Selected Storage:", req.body.storageType); // Debug log
    // console.log("File received by Multer:", req.file);
    try {
      let fileData = null;
      console.log("S3 Service: ", s3Service);
      // Select appropriate service based on the selectedStorage
      if (selectedStorage === "s3") {
        fileData = await s3Service.uploadFile(req.file);
      } else if (selectedStorage === "hdfs") {
        fileData = await hdfsService.uploadFile(req.file);
      } else if (selectedStorage === "mongo") {
        fileData = await mongoService.uploadFile(req.file);
      }
    //   console.log("Filepath: " + (fileData.filePath || "unknown"));

      fileData = {
        filePath: "https://google.com",
      };
      // Save file metadata to MongoDB (common for all storage types)
      const fileMetadata = {
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        storageType: req.body.storageType,
        filePath: fileData.filePath, // Path returned by the selected storage service
        uploadedBy: req.user.id, // Assuming req.user is populated by fetchUser middleware
      };

      const file = new File(fileMetadata);
      await file.save();

      return res.status(200).json({ success: true, file });
    } catch (error) {
      console.error("Error during file upload:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;

// const express = require('express');
// const validateStorage = require('../middleware/validateStorage');
// const File = require('../models/file');
// const router = express.Router();

// router.post('/upload', validateStorage, async (req, res) => {
//     try {
//         const { storageType } = req;
//         const file = req.files.file;

//         // Process the file based on storage type
//         let filePath = '';
//         switch (storageType) {
//             case 's3':
//                 filePath = await uploadToS3('myBucket', file); // Implement uploadToS3 function
//                 break;
//             case 'hdfs':
//                 filePath = await uploadToHDFS('/hdfs/path', file.path); // Implement uploadToHDFS function
//                 break;
//             case 'mongodb':
//                 filePath = await saveToMongoDB(file); // Implement saveToMongoDB function
//                 break;
//             default:
//                 throw new Error('Unsupported storage type');
//         }

//         // Save file metadata
//         const fileMetadata = await File.create({
//             fileName: file.name,
//             fileType: file.mimetype,
//             fileSize: file.size,
//             storageType,
//             filePath,
//             uploadedBy: req.user.id, // Assuming user authentication middleware
//         });

//         res.json({ message: 'File uploaded successfully', file: fileMetadata });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;
