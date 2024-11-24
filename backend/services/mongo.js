const { GridFSBucket } = require("mongodb");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Initialize MongoDB connection and GridFSBucket
let bucket; // Declare the bucket globally
const db = mongoose.connection;

// Set up the GridFSBucket when MongoDB connection is open
db.once("open", () => {
  bucket = new GridFSBucket(db.db, { bucketName: "uploads" });
  console.log("GridFSBucket initialized");
});

/**
 * Upload a file to MongoDB GridFS
 * @param {Object} file - File object from multer
 * @returns {Promise<Object>} - Returns the uploaded file's GridFS ID
 */
const uploadFile = async (file) => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const uploadStream = bucket.openUploadStream(file.originalname);
    fileStream.pipe(uploadStream);

    return new Promise((resolve, reject) => {
      uploadStream.on("finish", () => {
        console.log(`File uploaded to GridFS with ID: ${uploadStream.id}`);
        resolve({ filePath: `${uploadStream.id}` }); // Return the GridFS ID as a string
      });

      uploadStream.on("error", (err) => {
        console.error("Error during file upload to GridFS:", err);
        reject(err);
      });
    });
  } catch (err) {
    console.error("UploadFile error:", err);
    throw new Error("Failed to upload file to MongoDB");
  }
};

/**
 * Download a file from MongoDB GridFS
 * @param {String} filePath - The file's GridFS ID
 * @returns {Promise<Stream>} - Readable stream of the file
 */
const downloadFile = async (filePath) => {
  if (!bucket) {
    throw new Error("GridFSBucket is not initialized.");
  }

  return new Promise((resolve, reject) => {
    try {
      if (!ObjectId.isValid(filePath)) {
        throw new Error("Invalid file ID format.");
      }

      const fileId = new ObjectId(filePath); // Convert filePath to ObjectId
      const readStream = bucket.openDownloadStream(fileId);

      readStream.on("open", () => {
        console.log(`GridFS stream opened for file ID: ${filePath}`);
        resolve(readStream);
      });

      readStream.on("error", (err) => {
        console.error("Error while reading file from GridFS:", err);
        reject(new Error("Failed to download file from MongoDB"));
      });
    } catch (err) {
      console.error("Error during file download from MongoDB:", err);
      reject(new Error("Invalid file ID or error in GridFS"));
    }
  });
};

module.exports = { uploadFile, downloadFile };
