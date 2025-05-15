
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { handler } = require('../functions/calculate');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Handle calculate endpoint the same way the Netlify function would
app.post('/calculate', async (req, res) => {
  try {
    // Simulate the Netlify function environment
    const event = {
      body: JSON.stringify(req.body),
      headers: req.headers,
      httpMethod: 'POST'
    };
    
    const response = await handler(event);
    res.status(response.statusCode).send(response.body);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
