var filetype = null;
const storageSelector = (req, res, next) => {
  const isFile = req.file;
  console.log(isFile);
//   console.log("File received by Multer:", isFile); // Log file details
  if (!isFile) {
    return res.status(400).json({ error: "No file provided in the request" });
  }
  const fileSizeMB = isFile.size / (1024 * 1024);

  if (fileSizeMB <= 10) {
    req.body.storageType = "mongo";
    filetype = "mongo";
  } else if (fileSizeMB <= 100) {
    req.body.storageType = "hdfs";
    filetype = "hdfs";
  } else {
    req.body.storageType = "s3";
    filetype = "s3";
  }
// console.log(filetype);
  next();
};

module.exports = { storageSelector, filetype };
