<?php
// get_stats.php
// This file provides the current website stats in JSON format.
// Your console monitoring script will access this file via HTTP.

// Set the Content-Type header to application/json so browsers/clients know to expect JSON data.
header('Content-Type: application/json');

// Configuration - This path MUST match the path to website_stats.json used in your main website page (e.g., index.php).
// __DIR__ ensures the path is relative to where get_stats.php is located.
$statsFile = __DIR__ . '/website_stats.json';

// Check if the stats file exists.
if (file_exists($statsFile)) {
    // Attempt to open the file for reading.
    $fileHandle = fopen($statsFile, 'r');
    if ($fileHandle) {
        // Acquire a shared lock on the file for reading.
        // This prevents other processes from writing to the file while it's being read,
        // ensuring data consistency.
        if (flock($fileHandle, LOCK_SH)) {
            // Read the entire content of the file.
            $stats = fread($fileHandle, filesize($statsFile));
            // Release the file lock.
            flock($fileHandle, LOCK_UN);
            // Output the JSON content.
            echo $stats;
        } else {
            // If locking fails, send a 500 Internal Server Error.
            http_response_code(500);
            echo json_encode(['error' => 'Could not acquire file lock.']);
        }
        // Close the file handle.
        fclose($fileHandle);
    } else {
        // If the file cannot be opened for reading, send a 500 Internal Server Error.
        http_response_code(500);
        echo json_encode(['error' => 'Could not open stats file for reading.']);
    }
} else {
    // If the stats file doesn't exist yet (e.g., first visit to the main page),
    // return initial zero counts as JSON. This prevents errors for the console script.
    http_response_code(200); // OK status
    echo json_encode([
        'viewers' => 0,
        'uniqueViewers' => 0,
        'clicks' => 0,
        'lastUpdate' => date('c'), // Current timestamp
        'loggedIPs' => []
    ]);
}
?>
