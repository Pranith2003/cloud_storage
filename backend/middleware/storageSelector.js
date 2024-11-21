// middleware/storageSelector.js
const config = require('../config/storageConfig');  // Add your thresholds configuration

module.exports = (req, res, next) => {
    const { file } = req;

    // Example: Select storage backend based on file size
    if (file.size <= config.sizeThresholds.small) {
        req.selectedStorage = "mongo";  // Small files go to MongoDB
    } else if (file.size <= config.sizeThresholds.medium) {
        req.selectedStorage = "s3";    // Medium files go to S3
    } else {
        req.selectedStorage = "hdfs";  // Large files go to HDFS
    }

    // Log the selected storage
    console.log(`Selected storage for ${file.originalname}: ${req.selectedStorage}`);

    next();  // Continue to the next middleware or route handler
};
