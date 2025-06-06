const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // This PORT might not be directly used by Vercel's serverless environment, but useful for local testing

// --- Global Request Counter for easier tracking ---
let requestCounter = 0;

// --- Buffer for logs per request ---
const requestLogs = new Map();

// Define the order of log levels for printing
const logLevelOrder = ['success', 'info', 'debug', 'warn', 'error'];

// Function to log messages to a buffer
const log = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    const currentRequestId = app.locals.currentRequestId;

    if (typeof currentRequestId === 'undefined') {
        let prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        let coloredMessage = message;
        switch (level.toLowerCase()) {
            case 'info':
                prefix = `\x1b[36m${prefix}\x1b[0m`; // Cyan
                break;
            case 'debug':
                prefix = `\x1b[35m${prefix}\x1b[0m`; // Magenta
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
            console.log(data);
        }
    } else {
        if (!requestLogs.has(currentRequestId)) {
            requestLogs.set(currentRequestId, []);
        }
        requestLogs.get(currentRequestId).push({ timestamp, level, message, data });
    }
};

// Middleware to assign a unique ID to each request and clear logs
app.use((req, res, next) => {
    requestCounter++;
    app.locals.currentRequestId = requestCounter;
    requestLogs.set(requestCounter, []); // Initialize log buffer for this request
    log('info', `Request #${requestCounter}: ${req.method} ${req.originalUrl}`);

    // Custom headers for CORS policy before sending response
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this for production
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Use the cors middleware
app.use(cors());

// Configure multer for file storage
const imagesBasePath = path.join(__dirname, '..', 'public', 'blueprint_images'); // Store images in the public folder

// Ensure the blueprint_images directory exists
if (!fs.existsSync(imagesBasePath)) {
    fs.mkdirSync(imagesBasePath, { recursive: true });
    log('info', `Created blueprint image directory at: ${imagesBasePath}`);
} else {
    log('info', `Blueprint image directory already exists at: ${imagesBasePath}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        log('debug', `Multer destination callback. Request ID: ${app.locals.currentRequestId}`);
        cb(null, imagesBasePath);
    },
    filename: (req, file, cb) => {
        log('debug', `Multer filename callback. Original filename: ${file.originalname}, Request ID: ${app.locals.currentRequestId}`);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
        log('debug', `New filename generated: ${newFilename}, Request ID: ${app.locals.currentRequestId}`);
        cb(null, newFilename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        log('debug', `Multer fileFilter callback. File mimetype: ${file.mimetype}, Request ID: ${app.locals.currentRequestId}`);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            log('warn', `Attempted to upload non-image file: ${file.originalname} (${file.mimetype}). Request ID: ${app.locals.currentRequestId}`);
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

// Endpoint for file upload
app.post('/api/upload', (req, res, next) => {
    log('info', `Received POST request to /api/upload. Request ID: ${app.locals.currentRequestId}`);
    upload.single('blueprintImage')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                log('error', `Multer error during upload: ${err.message}. Code: ${err.code}. Request ID: ${app.locals.currentRequestId}`, err);
                return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
            } else if (err) {
                // An unknown error occurred.
                log('error', `Unknown error during upload: ${err.message}. Request ID: ${app.locals.currentRequestId}`, err);
                return res.status(500).json({ success: false, message: err.message || 'An unknown error occurred during upload.' });
            }
            // No error, proceed to next middleware if any, or finish response
        }
        // If file exists, it was successfully uploaded
        if (req.file) {
            log('success', `File uploaded successfully: ${req.file.filename}. Path: ${req.file.path}. Request ID: ${app.locals.currentRequestId}`, req.file);
            res.status(200).json({
                success: true,
                message: 'File uploaded successfully!',
                filename: req.file.filename,
                path: `/blueprint_images/${req.file.filename}` // Adjusted path for public access
            });
            log('info', `Response sent: SUCCESS (Status 200 - File Uploaded). Request ID: ${app.locals.currentRequestId}`);
        } else {
            log('warn', `No file provided in upload request. Request ID: ${app.locals.currentRequestId}`);
            res.status(400).json({ success: false, message: 'No file provided.' });
            log('info', `Response sent: FAILURE (Status 400 - No File). Request ID: ${app.locals.currentRequestId}`);
        }
    });
}, (err, req, res, next) => { // Centralized error handling for upload specifically
    if (err) {
        log('error', `Error in upload processing chain: ${err.message}. Request ID: ${app.locals.currentRequestId}`, err);
        res.status(500).json({ success: false, message: error.message || 'An unknown error occurred during upload.' });
        log('error', `Response sent: FAILURE (Status 500 - General Error). Request ID: ${app.locals.currentRequestId}.`);
    } else {
        log('warn', `Reached end of error handling middleware without specific error. This should not happen for upload errors. Request ID: ${app.locals.currentRequestId}.`);
        next();
    }
});

// General error handling middleware (for any other errors not caught above)
app.use((err, req, res, next) => {
    log('error', `Caught unhandled error in general error middleware: ${err.message}. Request ID: ${app.locals.currentRequestId}`, err.stack);
    res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
    log('error', `Response sent: FAILURE (Status 500 - Unhandled Error). Request ID: ${app.locals.currentRequestId}.`);
});

// Export the app for Vercel
module.exports = app;
