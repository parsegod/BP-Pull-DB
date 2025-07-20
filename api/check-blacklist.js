// api/check-blacklist.js
const path = require('path');
const fs = require('fs/promises'); // Use fs/promises for async file operations

module.exports = async (req, res) => {
  // Log all headers related to IP for debugging purposes
  console.log('--- Incoming Request IP Headers ---');
  console.log('x-forwarded-for:', req.headers['x-forwarded-for']);
  console.log('remoteAddress (connection):', req.connection.remoteAddress);
  console.log('socket.remoteAddress:', req.socket.remoteAddress);
  console.log('--- End IP Headers ---');

  // Get the user's IP address.
  // On Vercel, the client IP is typically in the 'x-forwarded-for' header.
  // It can be a comma-separated list, where the first IP is the client's.
  let clientIp = req.headers['x-forwarded-for'];
  if (clientIp) {
    clientIp = clientIp.split(',')[0].trim(); // Take the first IP if multiple are present
  } else {
    // Fallback for environments where x-forwarded-for might not be present
    // (though less common for public-facing Vercel deployments)
    clientIp = req.connection.remoteAddress || req.socket.remoteAddress;
  }

  // Log the final client IP being used for the check
  console.log(`Checking client IP: ${clientIp}`);

  // --- IMPORTANT: Blacklist Data Management ---
  const ipBlacklist = [
    '174.212.224.117'
  ];

  // Check if the client's IP is in the blacklist
  const isBlacklisted = ipBlacklist.includes(clientIp);

  if (isBlacklisted) {
    // Log the blacklisted IP for your records
    console.warn(`Blacklisted IP detected: ${clientIp}`);

    // Send a 403 Forbidden response with a custom HTML page for blacklisted IPs
    res.status(403).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied</title>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
        <link rel="icon" type="image/png" href="https://files.catbox.moe/pucbmh.png">
        <style>
          body {
            font-family: 'Oswald', sans-serif;
            background-color: #0B1738;
            color: #E0E8F0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
          }
          h1 {
            font-size: clamp(2em, 8vw, 3.5em);
            color: #E53E3E; /* Red for denied */
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          }
          p {
            font-family: 'Open Sans', sans-serif;
            font-size: clamp(1em, 4vw, 1.2em);
            margin-bottom: 30px;
            line-height: 1.5;
            max-width: 600px;
          }
          .logo {
            width: clamp(80px, 20vw, 120px);
            height: auto;
            margin-bottom: 30px;
            animation: pulse 2s infinite alternate;
          }
          @keyframes pulse {
            from { transform: scale(1); opacity: 0.8; }
            to { transform: scale(1.05); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <img src="https://files.catbox.moe/pucbmh.png" alt="Logo" class="logo">
        <h1>Verification Denied!</h1>
        <p>Your IP address (<code>${clientIp}</code>) has been blacklisted. Access to this site is forbidden.</p>
        <p>Detected IP for this request: <code>${clientIp}</code></p>
        <p>If you believe this is an error, please contact support.</p>
      </body>
      </html>
    `);
  } else {
    // If not blacklisted, serve the index.html file
    try {
      const indexPath = path.join(process.cwd(), 'index.html');
      const htmlContent = await fs.readFile(indexPath, 'utf8');
      res.status(200).setHeader('Content-Type', 'text/html').send(htmlContent);
    } catch (error) {
      console.error('Error serving index.html:', error);
      res.status(500).send('Internal Server Error: Could not load the main page.');
    }
  }
};