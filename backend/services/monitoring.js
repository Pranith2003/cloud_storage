const os = require('os');

const getSystemHealth = () => {
    return {
        uptime: os.uptime(), // System uptime in seconds
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
        },
        cpu: os.cpus(),
        loadAverage: os.loadavg(), // Load average (1, 5, and 15 minutes)
    };
};

const getServiceHealth = async () => {
    return {
        database: 'Connected', // Placeholder; add database-specific health checks if needed
        hdfs: 'Healthy',       // Placeholder; add HDFS-specific health checks
        s3: 'Healthy',         // Placeholder; add AWS S3-specific health checks
    };
};

module.exports = {
    getSystemHealth,
    getServiceHealth,
};
