import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors'; // For handling Cross-Origin Resource Sharing

const app = express();
const port = 3001; // Choose a port that's not your React app's port (e.g., 3000)

app.use(cors()); // Enable CORS for all routes (important for React app to connect)
app.use(express.json()); // To parse JSON request bodies

app.post('/api/get-page-info', async (req, res) => {
    const { url } = req.body;
    console.log(`Server.js: Received request for URL: ${url}`); // Log incoming request

    if (!url) {
        console.log("Server.js: Error - URL is missing.");
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        // Fetch the HTML content of the URL
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 seconds
        });
        console.log(`Server.js: Successfully fetched HTML for ${url}.`); // Log successful fetch

        // Load the HTML into cheerio for parsing
        const $ = cheerio.load(data);

        const title = $('title').text();
        const description = $('meta[property="og:description"]').attr('content') ||
                            $('meta[name="description"]').attr('content');

        console.log(`Server.js: Parsed Title: "${title}", Description: "${description || 'N/A'}" for ${url}`); // Log parsed info

        res.json({ url, title, description: description || 'No description found.' });

    } catch (error) {
        console.error(`Server.js: Error fetching or parsing URL ${url}:`, error.message);
        let errorMessage = 'Failed to fetch or parse URL content.';
        if (error.response) {
            errorMessage += ` Server responded with status ${error.response.status}.`;
            console.error(`Server.js: Axios response error data:`, error.response.data);
        } else if (error.code === 'ENOTFOUND') {
            errorMessage += ' Host not found (check URL for typos).';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage += ' Connection refused (server might be down, blocking requests, or CORS issue on target site).';
        } else if (error.code === 'ERR_SOCKET_TIMEOUT') {
            errorMessage += ' Request timed out.';
        } else if (error.code === 'ERR_BAD_RESPONSE') {
            errorMessage += ' Received a bad response from the target server.';
        }
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});