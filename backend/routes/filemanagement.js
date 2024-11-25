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
const path = require("path");

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  [fetchUser, upload.single("file"), storageSelector],
  async (req, res) => {
    const selectedStorage = req.selectedStorage; // Use the middleware-set value
    const { originalname, mimetype, size } = req.file;

    console.log("Selected Storage:", selectedStorage);

    try {
      let fileData = null;

      // Determine the storage service
      if (selectedStorage === "s3") {
        try {
          fileData = await s3Service.uploadFile(req.file);
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      } else if (selectedStorage === "hdfs") {
        try {
          fileData = await hdfsService.uploadFile(req.file);
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      } else if (selectedStorage === "mongo") {
        try {
          fileData = await mongoService.uploadFile(req.file);
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      }

      console.log("File Data from Storage Service:", fileData);

      if (!fileData || !fileData.filePath) {
        throw new Error("Failed to upload file or missing filePath.");
      }

      // Save metadata to MongoDB
      const fileMetadata = {
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        storageType: selectedStorage, // Use selectedStorage
        filePath: fileData.filePath, // Explicitly extract filePath
        uploadedBy: req.user.id,
      };
      console.log(fileMetadata);
      const file = new File(fileMetadata);
      await file.save();

      return res.status(200).json({ success: true, file });
    } catch (error) {
      console.error("Error during file upload:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.get("/list", fetchUser, async (req, res) => {
  try {
    // Fetch all files uploaded by the authenticated user
    const files = await File.find({ uploadedBy: req.user.id });

    if (!files || files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No files found" });
    }

    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Error fetching file list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/download/:id", fetchUser, async (req, res) => {
  const fileId = req.params.id;

  try {
    // Fetch file metadata from your database
    const file = await File.findById(fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Fetch the file stream from HDFS using its stored file path
    const fileStream = await hdfsService.downloadFile(file.filePath);
    if (!fileStream) {
      throw new Error("Failed to retrieve file stream from HDFS");
    }

    // Set headers to ensure the file is downloaded with the correct name and type
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );
    res.setHeader("Content-Type", file.fileType || "application/octet-stream");

    // Pipe the HDFS stream to the response
    fileStream.pipe(res);

    // Handle errors in the stream
    fileStream.on("error", (err) => {
      console.error("Stream encountered an error:", err);
      res.status(500).json({ success: false, message: "File stream error" });
    });

    fileStream.on("end", () => {
      console.log("Stream ended successfully.");
    });
  } catch (error) {
    console.error("Error during file download:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", fetchUser, async (req, res) => {
  const fileId = req.params.id;

  try {
    // Fetch file metadata from MongoDB
    const file = await File.findById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Delete the file from the appropriate storage service
    if (file.storageType === "s3") {
      await s3Service.deleteFile(file.filePath);
    } else if (file.storageType === "hdfs") {
      await hdfsService.deleteFile(file.filePath);
    } else if (file.storageType === "mongo") {
      await mongoService.deleteFile(file.filePath);
    }

    // Delete the file metadata from MongoDB
    await File.findByIdAndDelete(fileId);

    return res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error during file deletion:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
