const allowedStorageTypes = ["s3", "hdfs", "mongo"];

const validateStorage = (req, res, next) => {
  const { storageType } = req.body; // Assuming user sends storageType in the body

  // Check if storageType is valid
  if (!allowedStorageTypes.includes(storageType)) {
    return res.status(400).json({
      error: "Invalid storage type. Allowed types are: s3, hdfs, mongo.",
    });
  }

  // Attach the valid storageType to the request object for later use
  req.validatedStorage = storageType;

  next();
};

module.exports = validateStorage;
