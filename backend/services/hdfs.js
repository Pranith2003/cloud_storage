// services/hdfs.js
const hdfs = require("webhdfs");
const fs = require("fs");

// Initialize HDFS client
const hdfsClient = hdfs.createClient({
  user: "hadoop",
  host: "localhost",
  port: 9870,
  path: "/webhdfs/v1",
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const hdfsPath = `/user/hadoop/uploads/${file.originalname}`;
  const writeStream = hdfsClient.createWriteStream(hdfsPath);

  fileStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("close", () => {
      resolve({ filePath: hdfsPath });
    });

    writeStream.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = { uploadFile };
