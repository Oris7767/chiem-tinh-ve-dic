const express = require('express');
const cors = require('cors');
const path = require('path');
const swisseph = require('swisseph');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

// Đặt đường dẫn cho dữ liệu ephemeris
swisseph.swe_set_ephe_path(path.join(__dirname, 'ephe'));

// API endpoints
app.post('/api/calculate', (req, res) => {
  try {
    // Logic tính toán chiêm tinh ở đây
    // ...
    
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
