const supabaseService = require('./supabaseService');

class UserService {
  async getUsers(options = {}) {
    return supabaseService.getItems('users', options);
  }
  
  async getUserById(id) {
    return supabaseService.getItemById('users', id);
  }
  
  async createUser(userData) {
    // Xử lý logic trước khi tạo user
    const { email, password, ...profileData } = userData;
    
    // Đăng ký tài khoản
    const authData = await supabaseService.signUp(email, password, profileData);
    
    // Tạo profile cho user
    if (authData.user) {
      await supabaseService.createItem('profiles', {
        id: authData.user.id,
        ...profileData
      });
    }
    
    return authData;
  }
  
  async updateUser(id, updates) {
    return supabaseService.updateItem('profiles', id, updates);
  }
  
  async deleteUser(id) {
    // Thực hiện xóa user thông qua RPC function đã định nghĩa trong Supabase
    return supabaseService.callRpc('delete_user', { user_id: id });
  }
}

module.exports = new UserService();
