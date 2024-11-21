// routes/filemanagement.js
const express = require('express');
const multer = require('multer');
const fetchUser = require('../middleware/fetchuser');
const storageSelector = require('../middleware/storageSelector');
const s3Service = require('../services/s3');
const hdfsService = require('../services/hdfs');
const mongoService = require('../services/mongo');
const File = require('../models/file');
const router = express.Router();

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post("/upload", [fetchUser, upload.single('file'), storageSelector], async (req, res) => {
    const { selectedStorage } = req;  // The storage backend selected by storageSelector.js

    try {
        let fileData = null;

        // Select appropriate service based on the selectedStorage
        if (selectedStorage === "s3") {
            fileData = await s3Service.uploadFile(req.file);
        } else if (selectedStorage === "hdfs") {
            fileData = await hdfsService.uploadFile(req.file);
        } else if (selectedStorage === "mongo") {
            fileData = await mongoService.uploadFile(req.file);
        }

        // Save file metadata to MongoDB (common for all storage types)
        const fileMetadata = {
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            storageType: selectedStorage,
            filePath: fileData.filePath,  // Path returned by the selected storage service
            uploadedBy: req.user.id // Assuming req.user is populated by fetchUser middleware
        };

        const file = new File(fileMetadata);
        await file.save();

        return res.status(200).json({ success: true, file });
    } catch (error) {
        console.error("Error during file upload:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
