const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { authenticate } = require('../middlewares/auth');

// Public route - calculate chart without saving
router.post('/calculate', chartController.calculateChart);

// Protected routes - require authentication
router.post('/save', authenticate, chartController.calculateChart); // Same function but will save with auth
router.get('/user', authenticate, chartController.getUserCharts);
router.get('/:id', chartController.getChartById); // Public charts don't need auth
router.put('/:id', authenticate, chartController.updateChart);
router.delete('/:id', authenticate, chartController.deleteChart);

// Interpretation routes
router.get('/interpretation/:category/:subCategory/something', chartController.getInterpretation);

module.exports = router;
