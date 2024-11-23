module.exports = (req, res, next) => {
  const isFile = req.body.fileName;
  console.log(isFile);
  console.log("File received by Multer:", isFile); // Log file details
  if (!isFile) {
    return res.status(400).json({ error: "No file provided in the request" });
  }

  const fileSizeMB = req.body.fileSize / (1024 * 1024);

  if (fileSizeMB <= 10) {
    req.body.storageType = "mongo";
  } else if (fileSizeMB <= 100) {
    req.body.storageType = "hdfs";
  } else {
    req.body.storageType = "s3";
  }

  next();
};
