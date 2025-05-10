const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vedic Astrology API',
      version: '1.0.0',
      description: 'API for Vedic astrology calculations and chart management',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Import routes
const authRoutes = require('./routes/authRoutes');
const chartRoutes = require('./routes/chartRoutes');



// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
  validate: {
    xForwardedForHeader: false, // Tắt kiểm tra vì chúng ta xử lý IP thủ công
  }
});
app.use(limiter);
validate: {
  xForwardedForHeader: false, // Tắt kiểm tra vì chúng ta xử lý IP thủ công
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - ephemeris data
app.use('/ephe', express.static(path.join(__dirname, 'ephe')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charts', chartRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Hỗ trợ Netlify Functions hoặc các nền tảng serverless khác
if (process.env.NETLIFY) {
  const serverless = require('serverless-http');
  module.exports = serverless(app);
} else {
  // Start server chỉ khi không trong môi trường serverless
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

