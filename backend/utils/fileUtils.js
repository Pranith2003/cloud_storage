const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Generates a unique filename using a timestamp and a random string
 * @param {string} originalName - The original name of the file
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(originalName);
    return `${path.basename(originalName, extension)}-${timestamp}-${randomString}${extension}`;
};

/**
 * Converts file size from bytes to a human-readable format
 * @param {number} sizeInBytes - File size in bytes
 * @returns {string} - Human-readable file size
 */
const formatFileSize = (sizeInBytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let size = sizeInBytes;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
};

/**
 * Deletes a file from the local filesystem
 * @param {string} filePath - Path to the file
 */
const deleteLocalFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
    }
};

module.exports = {
    generateUniqueFilename,
    formatFileSize,
    deleteLocalFile,
};
