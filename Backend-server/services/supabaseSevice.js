const supabase = require('../config/supabase');

/**
 * Service để tương tác với Supabase
 */
class SupabaseService {
  /**
   * Lấy dữ liệu từ bảng với các tùy chọn lọc
   * @param {string} table - Tên bảng
   * @param {Object} options - Các tùy chọn query
   * @returns {Promise} - Promise chứa kết quả
   */
  async getItems(table, options = {}) {
    const { 
      select = '*', 
      filters = [], 
      page = 0, 
      limit = 100, 
      orderBy = { column: 'created_at', ascending: false } 
    } = options;
    
    let query = supabase
      .from(table)
      .select(select)
      .range(page * limit, (page + 1) * limit - 1)
      .order(orderBy.column, { ascending: orderBy.ascending });
    
    // Áp dụng các bộ lọc
    filters.forEach(filter => {
      const { column, operator, value } = filter;
      query = query.filter(column, operator, value);
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Lấy một item theo ID
   * @param {string} table - Tên bảng
   * @param {string|number} id - ID của item
   * @param {string} select - Các cột cần lấy
   * @returns {Promise} - Promise chứa kết quả
   */
  async getItemById(table, id, select = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Tạo mới một item
   * @param {string} table - Tên bảng
   * @param {Object} item - Dữ liệu item
   * @returns {Promise} - Promise chứa kết quả
   */
  async createItem(table, item) {
    const { data, error } = await supabase
      .from(table)
      .insert(item)
      .select();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Cập nhật một item
   * @param {string} table - Tên bảng
   * @param {string|number} id - ID của item
   * @param {Object} updates - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa kết quả
   */
  async updateItem(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Xóa một item
   * @param {string} table - Tên bảng
   * @param {string|number} id - ID của item
   * @returns {Promise} - Promise chứa kết quả
   */
  async deleteItem(table, id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, id };
  }
  
  /**
   * Thực hiện truy vấn RPC
   * @param {string} functionName - Tên function
   * @param {Object} params - Tham số
   * @returns {Promise} - Promise chứa kết quả
   */
  async callRpc(functionName, params = {}) {
    const { data, error } = await supabase
      .rpc(functionName, params);
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Xử lý xác thực người dùng
   * @param {string} email - Email
   * @param {string} password - Mật khẩu
   * @returns {Promise} - Promise chứa token và thông tin người dùng
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Đăng ký người dùng mới
   * @param {string} email - Email
   * @param {string} password - Mật khẩu
   * @param {Object} userData - Dữ liệu người dùng bổ sung
   * @returns {Promise} - Promise chứa kết quả
   */
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Upload file lên storage
   * @param {string} bucket - Tên bucket
   * @param {string} path - Đường dẫn file
   * @param {File} file - File cần upload
   * @returns {Promise} - Promise chứa kết quả
   */
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    return data;
  }
  
  /**
   * Lấy URL công khai của file
   * @param {string} bucket - Tên bucket
   * @param {string} path - Đường dẫn file
   * @returns {string} - URL công khai
   */
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

module.exports = new SupabaseService();
