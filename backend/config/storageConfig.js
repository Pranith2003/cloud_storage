// config/storageConfig.js
module.exports = {
    sizeThresholds: {
        small: 10 * 1024 * 1024,  // 10MB - MongoDB
        medium: 100 * 1024 * 1024 // 100MB - S3
    },
    defaultStorage: "s3"
};
