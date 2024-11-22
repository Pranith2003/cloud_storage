const express = require('express');
const validateStorage = require('../middleware/validateStorage');
const router = express.Router();

router.post('/upload', validateStorage, async (req, res) => {
    const { storageType } = req; // Retrieved from the middleware
    const file = req.files.file;

    try {
        switch (storageType) {
            case 's3':
                // Call AWS S3 service
                await uploadToS3('myBucket', file);
                res.send('File uploaded to S3');
                break;
            case 'hdfs':
                // Call HDFS service
                await uploadToHDFS('/path/on/hdfs', file.path);
                res.send('File uploaded to HDFS');
                break;
            case 'mongodb':
                // Call MongoDB service
                await saveToMongoDB(file);
                res.send('File saved to MongoDB');
                break;
            default:
                throw new Error('Unsupported storage type');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

// const express = require('express');
// const validateStorage = require('../middleware/validateStorage');
// const File = require('../models/file');
// const router = express.Router();

// router.post('/upload', validateStorage, async (req, res) => {
//     try {
//         const { storageType } = req;
//         const file = req.files.file;

//         // Process the file based on storage type
//         let filePath = '';
//         switch (storageType) {
//             case 's3':
//                 filePath = await uploadToS3('myBucket', file); // Implement uploadToS3 function
//                 break;
//             case 'hdfs':
//                 filePath = await uploadToHDFS('/hdfs/path', file.path); // Implement uploadToHDFS function
//                 break;
//             case 'mongodb':
//                 filePath = await saveToMongoDB(file); // Implement saveToMongoDB function
//                 break;
//             default:
//                 throw new Error('Unsupported storage type');
//         }

//         // Save file metadata
//         const fileMetadata = await File.create({
//             fileName: file.name,
//             fileType: file.mimetype,
//             fileSize: file.size,
//             storageType,
//             filePath,
//             uploadedBy: req.user.id, // Assuming user authentication middleware
//         });

//         res.json({ message: 'File uploaded successfully', file: fileMetadata });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;

