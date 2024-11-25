const winston = require('winston');

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Write logs to a file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// If in development mode, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

/**
 * Logs an informational message
 * @param {string} message - Message to log
 */
const logInfo = (message) => logger.info(message);

/**
 * Logs a warning message
 * @param {string} message - Message to log
 */
const logWarning = (message) => logger.warn(message);

/**
 * Logs an error message
 * @param {string} message - Message to log
 */
const logError = (message) => logger.error(message);

module.exports = {
    logInfo,
    logWarning,
    logError,
};
