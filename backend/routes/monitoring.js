const express = require('express');
const { getSystemHealth, getServiceHealth } = require('../services/monitoring');
const validateStorage = require('../middleware/validateStorage');

const router = express.Router();

/**
 * Route: Get system health
 * Description: Provides details about system performance, memory, CPU, and uptime.
 */
router.get('/system-health', (req, res) => {
    try {
        const systemHealth = getSystemHealth();
        res.json({
            status: 'OK',
            data: systemHealth,
        });
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({ error: 'Failed to fetch system health' });
    }
});

/**
 * Route: Get service health
 * Description: Checks the health of external services like database, HDFS, and AWS S3.
 */
router.get('/service-health', async (req, res) => {
    try {
        const serviceHealth = await getServiceHealth();
        res.json({
            status: 'OK',
            data: serviceHealth,
        });
    } catch (error) {
        console.error('Error fetching service health:', error);
        res.status(500).json({ error: 'Failed to fetch service health' });
    }
});

/**
 * Route: Check storage type health
 * Description: Validates the storage type (e.g., S3, HDFS, MongoDB) and checks its availability.
 */
router.get('/storage-health', validateStorage, async (req, res) => {
    try {
        const { storageType } = req;
        const message = `${storageType.toUpperCase()} is healthy and available for use.`;

        res.json({
            status: 'OK',
            data: {
                storageType,
                message,
            },
        });
    } catch (error) {
        console.error('Error checking storage health:', error);
        res.status(500).json({ error: 'Failed to check storage health' });
    }
});

module.exports = router;
