const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

// Configure S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFile = async (file) => {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${file.originalname}`,
        Body: fileStream,
        ACL: 'public-read' // Optional: You may need to adjust permissions depending on your setup
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        const result = await s3Client.send(command);
        return {
            filePath: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`
        };
    } catch (err) {
        console.error("Error uploading file:", err);
        throw new Error("File upload failed");
    }
};

module.exports = { uploadFile };
