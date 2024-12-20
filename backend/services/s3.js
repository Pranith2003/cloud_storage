const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();

// Configure S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${file.originalname}`,
    Body: fileStream,
    // ACL: 'public-read' // Optional: You may need to adjust permissions depending on your setup
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const result = await s3Client.send(command);
    return {
      filePath: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
    };
  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("File upload failed");
  }
};

const downloadFile = async (filePath) => {
  const bucketName = process.env.S3_BUCKET_NAME;

  // Extract the S3 Key from the filePath
  const url = new URL(filePath); // Parse the filePath as a URL
  const key = url.pathname.substring(1); // Extract the relative path without leading "/"

  if (!key) {
    throw new Error("Invalid file path provided for S3 download.");
  }

  const params = {
    Bucket: bucketName,
    Key: key, // Correctly extracted Key
  };

  try {
    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);
    return Body; // Return readable stream
  } catch (err) {
    console.error("Error downloading file from S3:", err.message);
    throw new Error("Failed to download file from S3");
  }
};

const getMetrics = async () => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: "uploads/", // Fetch objects in the 'uploads' directory
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // Calculate metrics
    const files = response.Contents || [];
    const fileCount = files.length;
    const totalSize = files.reduce((sum, file) => sum + (file.Size || 0), 0);

    return {
      fileCount,
      totalSize, // in bytes
    };
  } catch (err) {
    console.error("Error fetching S3 metrics:", err.message);
    throw new Error("Failed to fetch S3 metrics");
  }
};

const deleteFile = async (filePath) => {
  const bucketName = process.env.S3_BUCKET_NAME;

  // Extract the S3 Key from the filePath
  const url = new URL(filePath); // Parse the filePath as a URL
  const key = url.pathname.substring(1); // Extract the relative path without leading "/"

  if (!key) {
    throw new Error("Invalid file path provided for S3 deletion.");
  }

  const params = {
    Bucket: bucketName,
    Key: key, // Correctly extracted Key
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`File ${filePath} deleted successfully from S3.`);
    return { success: true, message: `File ${filePath} deleted successfully.` };
  } catch (err) {
    console.error("Error deleting file from S3:", err.message);
    throw new Error("Failed to delete file from S3");
  }
};

module.exports = { uploadFile, downloadFile, getMetrics, deleteFile };
