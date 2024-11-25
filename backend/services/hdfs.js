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

const deleteFile = async (filePath) => {
  try {
    console.log(`Attempting to delete file from HDFS: ${filePath}`);

    return new Promise((resolve, reject) => {
      hdfsClient.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file from HDFS: ${filePath}`, err);
          return reject(
            new Error(`Failed to delete file from HDFS: ${err.message}`)
          );
        }

        console.log(`File successfully deleted from HDFS: ${filePath}`);
        resolve({ message: `File successfully deleted from ${filePath}` });
      });
    });
  } catch (error) {
    console.error("DeleteFile error:", error);
    throw new Error("Failed to delete file from HDFS");
  }
};

const getMetrics = async () => {
  try {
    const directoryPath = "/user/hadoop/uploads"; // Adjust as per your HDFS setup
    console.log(`Fetching HDFS metrics for directory: ${directoryPath}`);

    return new Promise((resolve, reject) => {
      hdfsClient.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error(`Error reading directory ${directoryPath}:`, err);
          return reject(
            new Error(`Failed to fetch HDFS metrics: ${err.message}`)
          );
        }

        const fileCount = files.length;
        const totalSize = files.reduce((acc, file) => acc + file.length, 0); // Assuming `length` provides file size in bytes

        console.log(`HDFS Metrics: ${fileCount} files, ${totalSize} bytes`);
        resolve({ fileCount, totalSize });
      });
    });
  } catch (error) {
    console.error("Error fetching HDFS metrics:", error);
    throw new Error("Failed to fetch HDFS metrics");
  }
};

const getFilesInDirectory = async (directoryPath) => {
  try {
    console.log(hdfsClient);

    // Use the proper method to list files in the directory
    const fileStatus = await new Promise((resolve, reject) => {
      hdfsClient.readdir(directoryPath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });

    // Extract file paths from the readdir result
    const fileList = fileStatus.map((file) => file.name); // Adjust according to the returned object structure
    return fileList;
  } catch (error) {
    console.error("Error fetching files in directory:", error);
    throw new Error("Failed to fetch files in HDFS directory");
  }
};

const getHDFSFileInfo = async (filePath) => {
  try {
    // Fetch the file status from HDFS (includes metadata and block info)
    const fileStatus = await hdfsClient.getStatus(filePath);
    console.log("File Status:", fileStatus);

    // Get block locations (this shows how the file is distributed)
    const blockInfo = await hdfsClient.getBlockLocations(filePath);
    console.log("Block Locations:", blockInfo);

    return {
      fileStatus: fileStatus,
      blockInfo: blockInfo,
    };
  } catch (error) {
    console.error("Error fetching HDFS file info:", error);
    throw new Error("Failed to fetch file info from HDFS");
  }
};

// Route to get HDFS metrics
const getHDFSMetrics = async (req, res) => {
  const filePath = "/user/hadoop/uploads/example.txt"; // Example file path in HDFS

  try {
    const { fileStatus, blockInfo } = await getHDFSFileInfo(filePath);
    res.status(200).json({
      fileStatus: fileStatus,
      blockInfo: blockInfo,
    });
  } catch (error) {
    console.error("Error in getHDFSMetrics:", error);
    res.status(500).json({
      error: "Failed to fetch HDFS metrics",
    });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  getMetrics,
  getHDFSMetrics,
  getFilesInDirectory,
};
