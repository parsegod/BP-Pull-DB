const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // fs is still needed for path operations, even if not for writing

const app = express();
// The PORT is mainly for local testing. Vercel's serverless environment manages ports automatically.
const PORT = 3000; 

// --- Global Request Counter for easier tracking ---
let requestCounter = 0;

// --- Buffer for logs per request ---
// This Map will store log entries for each request, keyed by requestCounter.
// Each value will be an array of { timestamp, level, message, data } objects.
const requestLogs = new Map();

// Define the order of log levels for printing
const logLevelOrder = ['success', 'info', 'debug', 'warn', 'error'];

// Function to log messages to a buffer
const log = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    const currentRequestId = app.locals.currentRequestId; // Get the request ID from app.locals

    // If currentRequestId is not set yet (e.g., during initial server startup logs),
    // we'll log directly to console. Otherwise, buffer.
    if (typeof currentRequestId === 'undefined') {
        let prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        let coloredMessage = message;
        switch (level.toLowerCase()) {
            case 'info':
                prefix = `\x1b[36m${prefix}\x1b[0m`; // Cyan
                break;
            case 'debug':
                prefix = `\x1b[90m${prefix}\x1b[0m`; // Bright Black (Gray)
                break;
            case 'warn':
                prefix = `\x1b[33m${prefix}\x1b[0m`; // Yellow
                break;
            case 'error':
                prefix = `\x1b[31m${prefix}\x1b[0m`; // Red
                break;
            case 'success':
                prefix = `\x1b[32m${prefix}\x1b[0m`; // Green
                break;
            default:
                break;
        }
        console.log(`${prefix} ${coloredMessage}`);
        if (data) {
            // Increased indentation for data to help with readability/visual "wrap"
            console.log(`  \x1b[90mData:\x1b[0m ${JSON.stringify(data, null, 4).replace(/\n/g, '\n    ')}`);
        }
        return;
    }


    if (!requestLogs.has(currentRequestId)) {
        requestLogs.set(currentRequestId, []);
    }

    // Store the log entry in the buffer for the current request
    requestLogs.get(currentRequestId).push({
        timestamp,
        level: level.toLowerCase(), // Store level as lowercase for consistent sorting
        message,
        data
    });
};

// Function to flush (print and clear) logs for a specific request
const flushRequestLogs = (requestId) => {
    const logsToPrint = requestLogs.get(requestId);

    if (!logsToPrint || logsToPrint.length === 0) {
        return; // No logs for this request
    }

    // Sort logs based on the defined order
    logsToPrint.sort((a, b) => {
        const levelAIndex = logLevelOrder.indexOf(a.level);
        const levelBIndex = logLevelOrder.indexOf(b.level);

        if (levelAIndex === levelBIndex) {
            // If levels are the same, maintain original chronological order
            // This ensures stability for logs of the same level
            return a.timestamp.localeCompare(b.timestamp);
        }
        // Sort by level index (lower index means higher priority in the desired order)
        return levelAIndex - levelBIndex;
    });

    // Print sorted logs to console with colors
    logsToPrint.forEach(logEntry => {
        let prefix = `[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}]`;
        let coloredMessage = logEntry.message;

        switch (logEntry.level) {
            case 'info':
                prefix = `\x1b[36m${prefix}\x1b[0m`; // Cyan
                break;
            case 'debug':
                prefix = `\x1b[90m${prefix}\x1b[0m`; // Bright Black (Gray)
                break;
            case 'warn':
                prefix = `\x1b[33m${prefix}\x1b[0m`; // Yellow
                break;
            case 'error':
                prefix = `\x1b[31m${prefix}\x1b[0m`; // Red
                break;
            case 'success':
                prefix = `\x1b[32m${prefix}\x1b[0m`; // Green
                break;
            default:
                break;
        }

        console.log(`${prefix} ${coloredMessage}`);
        if (logEntry.data) {
            // Increased indentation for data to help with readability/visual "wrap"
            console.log(`  \x1b[90mData:\x1b[0m ${JSON.stringify(logEntry.data, null, 4).replace(/\n/g, '\n    ')}`);
        }
    });

    // Clear logs for this request from the buffer
    requestLogs.delete(requestId);
};


// --- Middleware Setup ---
// This middleware ensures that the currentRequestId is set for each request
// and that logs are flushed at the end of the request.
app.use((req, res, next) => {
    requestCounter++; // Increment for each new incoming request
    app.locals.currentRequestId = requestCounter; // Store current request ID for the log function

    // Log initial request details
    log('info', `\n======================================================`);
    log('info', `  INCOMING REQUEST #${app.locals.currentRequestId}`);
    log('info', `======================================================`);
    log('debug', `Request Method: ${req.method}, Path: ${req.originalUrl}`);
    log('debug', `Client IP: ${req.ip || req.connection.remoteAddress || 'N/A'}`);
    log('debug', `Origin: ${req.headers.origin || 'N/A'}`);
    log('debug', `User-Agent: ${req.headers['user-agent'] || 'N/A'}`);

    // Attach a listener to the 'finish' event of the response to flush logs
    res.on('finish', () => {
        flushRequestLogs(app.locals.currentRequestId);
    });

    next(); // Pass control to the next middleware
});

app.use(cors((req, callback) => {
    // CORS middleware processed after the request ID is set
    callback(null, { origin: true }); // Allow all origins for development
    log('info', `CORS middleware processed.`);
}));
log('info', 'Express JSON parser applied globally.'); // This log is outside a request context

app.use(express.json()); // To parse JSON bodies if needed for other requests
log('info', 'Express JSON parser applied globally.'); // This log is outside a request context

// Define the base path for your blueprint images where they are *expected to be served from*
// by the frontend (ju.html). This is not where the server will save them.
const imagesBasePath = path.join(__dirname, '..', 'public', 'assets', 'blueprints', 'images');
log('info', `Frontend expects images from: '${imagesBasePath}' (Note: Server won't save here on Vercel)`); // This log is outside a request context

// --- Multer Storage Configuration ---
// Changed to memoryStorage as diskStorage is not suitable for Vercel's ephemeral filesystem
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage, // Use memory storage
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (5MB)
    fileFilter: (req, file, cb) => {
        log('info', `\n--- Multer FileFilter Logic (Request #${app.locals.currentRequestId}) ---`);
        log('debug', `Checking incoming file: Originalname='${file.originalname}', MIME Type='${file.mimetype}', Size=${file.size} bytes`);

        // Define allowed file types and extensions
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedExtensionsRegex = /\.(jpg|jpeg|png|gif)$/i; // Case-insensitive regex

        const isExtensionAllowed = allowedExtensionsRegex.test(file.originalname);
        const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);

        log('debug', `Is file extension ('${path.extname(file.originalname)}') allowed? ${isExtensionAllowed}`);
        log('debug', `Is MIME type ('${file.mimetype}') allowed? ${isMimeTypeAllowed}`);

        if (!isExtensionAllowed || !isMimeTypeAllowed) {
            req.fileValidationError = `File type not allowed. Only JPG, JPEG, PNG, GIF images are permitted. Received: '${file.originalname}' (MIME: '${file.mimetype}')`;
            log('error', `File type validation failed: ${req.fileValidationError}`);
            return cb(new Error(req.fileValidationError), false);
        }
        log('success', `File type accepted. Proceeding with upload.`);
        cb(null, true);
    }
});

// --- Image Upload Endpoint ---
// This endpoint will be accessible via /api/upload-blueprint-image on Vercel
app.post('/api/upload-blueprint-image', upload.single('blueprintImage'), (req, res) => {
    log('info', `\n--- POST /api/upload-blueprint-image Handler (Request #${app.locals.currentRequestId}) ---`);
    log('debug', `Request successfully passed Multer middleware.`);
    log('debug', `Final Request Body after Multer processing:`, req.body);
    log('debug', `Final File Object (if uploaded successfully):`, req.file);

    if (req.file) {
        log('success', `Image upload received successfully in memory!`);
        log('info', `File details received:`);
        log('info', `  - Original Name:   '${req.file.originalname}'`);
        log('info', `  - MimeType:        '${req.file.mimetype}'`);
        log('info', `  - Size:            ${req.file.size} bytes`);
        log('warn', `NOTE: On Vercel, files cannot be saved to the local filesystem. This file (${req.file.originalname}) was processed in memory but NOT persistently stored. For persistent storage, integrate with a cloud storage service like AWS S3 or Google Cloud Storage.`);
        
        // In a real application, you would now upload req.file.buffer to your cloud storage
        // Example (conceptual, requires cloud storage SDK/API calls):
        // await cloudStorageService.upload(req.file.originalname, req.file.buffer, req.file.mimetype);

        res.json({ 
            success: true, 
            message: 'Image uploaded successfully (processed in memory, not persistently stored on server).', 
            filename: req.file.originalname // Return original name as a placeholder
        });
        log('success', `Response sent: SUCCESS (Status 200 - Simulated Upload).`);
    } else {
        log('error', `Image upload failed!`);
        log('error', `Failure reason: ${req.fileValidationError || 'No file received or invalid file type.'}`);
        res.status(400).json({ success: false, message: req.fileValidationError || 'No file received or invalid file type.' });
        log('error', `Response sent: FAILURE (Status 400).`);
    }
}, (error, req, res, next) => {
    // --- Centralized Error Handling for Uploads ---
    log('error', `\n--- Error Handling Middleware (Request #${app.locals.currentRequestId}) ---`);
    log('error', `An error occurred during file upload processing.`);

    if (error instanceof multer.MulterError) {
        log('error', `Multer Error Detected: Code: ${error.code}, Message: ${error.message}`);
        let errorMessage = error.message;
        if (error.code === 'LIMIT_FILE_SIZE') {
            errorMessage = `File size too large. Max allowed is ${upload.limits.fileSize / (1024 * 1024)}MB.`;
            log('error', `Specific Multer Error: File size limit exceeded.`);
        } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            errorMessage = `Too many files or unexpected field name. Please ensure only one 'blueprintImage' file is sent.`;
            log('error', `Specific Multer Error: Unexpected file field.`);
        }
        res.status(500).json({ success: false, message: errorMessage });
        log('error', `Response sent: FAILURE (Status 500 - Multer Error).`);
    } else if (req.fileValidationError) {
        // Custom fileFilter error
        log('error', `File Validation Error: ${req.fileValidationError}`);
        res.status(400).json({ success: false, message: req.fileValidationError });
        log('error', `Response sent: FAILURE (Status 400 - Validation Error).`);
    } else if (error) {
        // Other general errors (e.g., from destination callback, or unhandled exceptions)
        log('error', `Unhandled General Error:`, error);
        res.status(500).json({ success: false, message: error.message || 'An unknown error occurred during upload.' });
        log('error', `Response sent: FAILURE (Status 500 - General Error).`);
    } else {
        // Fallback for any unhandled case, though `next()` should prevent this if an error occurred
        log('warn', `Reached end of error handling middleware without specific error. This should not happen for upload errors.`);
        next(); // Pass to next middleware if no error handled (shouldn't happen for upload errors)
    }
});

// Export the Express app for Vercel's serverless function environment
module.exports = app;

// --- Server Start (Commented out for Vercel deployment) ---
// This block is typically for local development when running `node server.js` directly.
// Vercel manages the server process for serverless functions.
/*
app.listen(PORT, () => {
    // These logs are for server startup and are not associated with a specific request,
    // so they are printed directly.
    console.log(`\n\n======================================================`);
    console.log(`                 NODE.JS SERVER STARTED               `);
    console.log(`======================================================`);
    console.log(`Server is now running and listening on: \x1b[34mhttp://localhost:${PORT}\x1b[0m`); // Blue URL
    console.log(`Blueprint images will be stored under the base path: \x1b[35m${imagesBasePath}\x1b[0m`); // Magenta path
    console.log(`------------------------------------------------------`);
    console.log(`Server is ready to receive file upload requests.`);
    console.log(`Watch this terminal for detailed logging of each request.`);
    console.log(`======================================================\n`);
});
*/
