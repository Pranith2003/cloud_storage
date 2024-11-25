const WebHDFS = require('webhdfs'); // Import the webhdfs library

// HDFS Configuration
const hdfs = WebHDFS.createClient({
    user: process.env.HDFS_USER || 'hdfs', // Default HDFS user
    host: process.env.HDFS_HOST || 'localhost', // Host where HDFS is running
    port: process.env.HDFS_PORT || 50070, // WebHDFS port (default: 50070 for Namenode)
    path: process.env.HDFS_PATH || '/webhdfs/v1', // HDFS REST API path
});

// Utility function for HDFS write
const writeFileToHDFS = async (localFilePath, hdfsFilePath) => {
    return new Promise((resolve, reject) => {
        const fs = require('fs'); // Native filesystem module
        const localFileStream = fs.createReadStream(localFilePath);

        const remoteFileStream = hdfs.createWriteStream(hdfsFilePath);
        localFileStream.pipe(remoteFileStream);

        remoteFileStream.on('error', (error) => {
            console.error('Error writing file to HDFS:', error);
            reject(error);
        });

        remoteFileStream.on('finish', () => {
            console.log('File successfully written to HDFS:', hdfsFilePath);
            resolve(hdfsFilePath);
        });
    });
};

// Utility function for HDFS read
const readFileFromHDFS = async (hdfsFilePath, localFilePath) => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const localFileStream = fs.createWriteStream(localFilePath);

        const remoteFileStream = hdfs.createReadStream(hdfsFilePath);
        remoteFileStream.pipe(localFileStream);

        remoteFileStream.on('error', (error) => {
            console.error('Error reading file from HDFS:', error);
            reject(error);
        });

        localFileStream.on('finish', () => {
            console.log('File successfully read from HDFS:', localFilePath);
            resolve(localFilePath);
        });
    });
};

// Utility function for HDFS delete
const deleteFileFromHDFS = async (hdfsFilePath) => {
    return new Promise((resolve, reject) => {
        hdfs.unlink(hdfsFilePath, (error) => {
            if (error) {
                console.error('Error deleting file from HDFS:', error);
                reject(error);
            } else {
                console.log('File successfully deleted from HDFS:', hdfsFilePath);
                resolve(hdfsFilePath);
            }
        });
    });
};

module.exports = {
    hdfs,
    writeFileToHDFS,
    readFileFromHDFS,
    deleteFileFromHDFS,
};
