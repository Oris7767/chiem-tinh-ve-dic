const userService = require('../services/userService');

/**
 * Controller xử lý các request liên quan đến user
 */
class UserController {
  /**
   * Lấy danh sách users
   */
  async getUsers(req, res) {
    try {
      const { page, limit, orderBy, ...filters } = req.query;
      
      // Chuyển đổi query params thành options
      const options = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 10,
        orderBy: orderBy ? JSON.parse(orderBy) : undefined,
        filters: Object.entries(filters).map(([key, value]) => ({
          column: key,
          operator: 'eq',
          value
        }))
      };
      
      const users = await userService.getUsers(options);
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Lấy thông tin một user
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Tạo user mới
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      const result = await userService.createUser(userData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Cập nhật thông tin user
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Kiểm tra quyền (chỉ admin hoặc chính user đó mới được cập nhật)
      if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      
      const updatedUser = await userService.updateUser(id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Xóa user
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Kiểm tra quyền (chỉ admin mới được xóa user)
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin permission required' });
      }
      
      await userService.deleteUser(id);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
