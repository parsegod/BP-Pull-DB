// Function to fetch and serve Lanyard API data
module.exports = async (req, res) => {
    // Hardcoded user ID from your script.js
    const userId = '1285264427540545588';
    
    // Lanyard REST API endpoint
    const lanyardApiUrl = `https://api.lanyard.rest/v1/users/${userId}`;

    try {
        // Fetch data from the Lanyard REST API
        const response = await fetch(lanyardApiUrl);

        // Check if the Lanyard API responded successfully
        if (!response.ok) {
            // Forward the error status and message
            res.status(response.status).json({
                error: `Failed to fetch Lanyard data: ${response.statusText}`
            });
            return;
        }

        // Parse the JSON data from the Lanyard API
        const data = await response.json();

        // Check if the data is valid
        if (data.success && data.data) {
            // If the request is successful, return the Lanyard data
            res.status(200).json(data.data);
        } else {
            // If the Lanyard API returns a non-successful response
            res.status(500).json({ error: "Lanyard API returned an unsuccessful response." });
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Proxy function error:', error);
        res.status(500).json({ error: "Internal server error." });
    }
};