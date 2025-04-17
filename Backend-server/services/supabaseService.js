const supabase = require('../config/supabase');

class SupabaseService {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
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
  
  async getUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async createBirthChart(chartData) {
    const { data, error } = await supabase
      .from('birth_charts')
      .insert(chartData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async getBirthCharts(userId) {
    const { data, error } = await supabase
      .from('birth_charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  async getBirthChart(chartId, userId) {
    const query = supabase
      .from('birth_charts')
      .select('*')
      .eq('id', chartId);
    
    // Nếu có userId, thêm điều kiện để đảm bảo người dùng chỉ xem được chart của mình
    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('is_public', true);
    }
    
    const { data, error } = await query.single();
    
    if (error) throw error;
    return data;
  }
  
  async updateBirthChart(chartId, userId, updates) {
    const { data, error } = await supabase
      .from('birth_charts')
      .update(updates)
      .eq('id', chartId)
      .eq('user_id', userId) // Đảm bảo chỉ cập nhật chart của chính user
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async deleteBirthChart(chartId, userId) {
    const { error } = await supabase
      .from('birth_charts')
      .delete()
      .eq('id', chartId)
      .eq('user_id', userId); // Đảm bảo chỉ xóa chart của chính user
    
    if (error) throw error;
    return { success: true };
  }
  
  async getInterpretations(category, subCategory = null) {
    let query = supabase
      .from('interpretations')
      .select('*')
      .eq('category', category);
    
    if (subCategory) {
      query = query.eq('sub_category', subCategory);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseService();
