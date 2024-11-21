// services/mongo.js
const GridFSBucket = require('mongodb').GridFSBucket;
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Initialize MongoDB connection and GridFS
const db = mongoose.connection;
const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

const uploadFile = async (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadStream = bucket.openUploadStream(file.originalname);
    fileStream.pipe(uploadStream);

    return new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
            resolve({ filePath: `/uploads/${uploadStream.id}` });
        });

        uploadStream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { uploadFile };
