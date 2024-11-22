const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true, // e.g., "image/png", "application/pdf"
    },
    fileSize: {
      type: Number,
      required: true, // File size in bytes
    },
    storageType: {
      type: String,
      required: true, // e.g., "s3", "hdfs", "mongodb"
      enum: ["s3", "hdfs", "mongodb"], // Limit storage types
    },
    filePath: {
      type: String,
      required: true, // Path or URL where the file is stored
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the file
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the File model
module.exports = mongoose.model("file", fileSchema);
