const validStorageTypes = ["s3", "hdfs", "mongodb"]; // List of supported storage types
const validateStorage = (req, res, next) => {
  try {
    // Extract the storage type from request headers, query, or body (customize as needed)
    const { storageType } = req.body;
    // Check if the storageType is provided
    if (!storageType) {
      return res.status(400).json({ error: "Storage type is required." });
    }
    // Validate the storage type
    if (!validStorageTypes.includes(storageType.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid storage type. Supported types are: ${validStorageTypes.join(
          ", "
        )}`,
      });
    }
    // Attach the validated storage type to the request for further use
    req.storageType = storageType.toLowerCase();
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error in validateStorage middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = validateStorage;
