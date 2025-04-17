const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

// Public routes
router.post('/', userController.createUser); // Đăng ký user mới

// Protected routes (yêu cầu xác thực)
router.get('/', authenticate, userController.getUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
