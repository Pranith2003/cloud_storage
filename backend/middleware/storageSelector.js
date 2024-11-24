const storageSelector = (req, res, next) => {
  const isFile = req.file;
  if (!isFile) {
    return res.status(400).json({ error: "No file provided in the request" });
  }
  const fileSizeMB = isFile.size / (1024 * 1024);

  if (fileSizeMB <= 10) {
    req.selectedStorage = "mongo";
  } else if (fileSizeMB <= 100) {
    req.selectedStorage = "hdfs";
  } else {
    req.selectedStorage = "s3";
  }

  console.log("Selected Storage Type:", req.selectedStorage);
  next();
};

module.exports = { storageSelector };
