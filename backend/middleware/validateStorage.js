const allowedStorageTypes = ['s3', 'hdfs', 'mongo'];

const validateStorage = (req, res, next) => {
    const { storageType } = req.body; // Get storageType from the body (or query params)
    console.log()

    // Check if storageType is valid
    if (!allowedStorageTypes.includes(storageType)) {
        return res.status(400).json({ error: 'Invalid storage type. Allowed types are: s3, hdfs, mongo.' });
    }

    // Attach the valid storageType to the request object for later use
    req.storageType = storageType;

    // Proceed to the next middleware or route handler
    next();
};

module.exports = validateStorage;
