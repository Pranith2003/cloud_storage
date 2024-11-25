const WebHDFS = require("webhdfs");
const fs = require("fs");

// Initialize HDFS client
const hdfsClient = WebHDFS.createClient({
  user: "hadoop", // Replace with your HDFS username
  host: "localhost", // HDFS NameNode host
  port: 9870, // WebHDFS port
  path: "/webhdfs/v1", // WebHDFS base path
});

// /**
//  * Upload a file to HDFS
//  * @param {Object} file - File object from multer
//  * @returns {Promise<Object>} - Returns the HDFS file path
//  */
const uploadFile = async (file) => {
  try {
    console.log(file);
    const fileStream = fs.createReadStream(file.path);
    const hdfsPath = `/user/hadoop/uploads/${file.originalname}`; // Destination path in HDFS
    console.log(`Uploading file to HDFS at path: ${hdfsPath}`);

    const writeStream = hdfsClient.createWriteStream(hdfsPath);
    fileStream.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("close", () => {
        console.log(`File uploaded successfully to ${hdfsPath}`);
        resolve({ filePath: hdfsPath });
      });

      writeStream.on("error", (err) => {
        console.error("Error uploading to HDFS:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("UploadFile error:", error);
    throw new Error("Failed to upload file to HDFS");
  }
};

// /**
//  * Download a file from HDFS
//  * @param {String} filePath - Path to the file in HDFS
//  * @returns {Promise<Stream>} - Returns a readable stream for the file
//  */

const downloadFile = async (filePath) => {
  try {
    console.log(`Attempting to read file from HDFS: ${filePath}`);
    const readStream = hdfsClient.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      readStream.on("response", (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download file. HTTP Status: ${response.statusCode}`
            )
          );
        } else {
          console.log("Stream successfully opened for:", filePath);
          resolve(response); // Return the HTTP response as the stream
        }
      });

      readStream.on("error", (err) => {
        console.error(`Error while reading from HDFS: ${filePath}`, err);
        reject(new Error(`Failed to download file from HDFS: ${err.message}`));
      });
    });
  } catch (error) {
    console.error("DownloadFile error:", error);
    throw new Error("Failed to download file from HDFS");
  }
};

module.exports = { uploadFile, downloadFile };
