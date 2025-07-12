// Import required modules and load enviroment variables
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Get OpenAI API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Endpoint to generate an image from a text prompt using OpenAI API
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;
    // Return error if prompt is missing
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
        // Send request to OpenAI API to generate an image
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            // Creates a picture with specifcations below
            // model: "dall-e-3" is the model used to generate images
            body: JSON.stringify({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            })
        });
        // Return the image data to the frontend
        const data = await response.json();
        res.json(data);
    } catch (err) {
        // Log error and return server error response
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Only start the server if this file is run directly, not when imported for tests
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;