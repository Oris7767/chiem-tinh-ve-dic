// frontend-server/src/services/chartService.ts
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ChartData {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const chartService = {
  async saveChart(chartData: ChartData) {
    try {
      // Gửi dữ liệu đến backend để xử lý và lưu vào Supabase
      const response = await fetch(`${API_URL}/charts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chartData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create chart');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error saving chart:', error);
      throw error;
    }
  },

  async getChart(id: string) {
    try {
      // Lấy dữ liệu từ backend (backend sẽ truy vấn Supabase)
      const response = await fetch(`${API_URL}/charts/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch chart');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting chart:', error);
      throw error;
    }
  },

  async getCharts() {
    try {
      // Lấy danh sách chart từ backend
      const response = await fetch(`${API_URL}/charts`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch charts');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting charts:', error);
      throw error;
    }
  },

  async deleteChart(id: string) {
    try {
      // Xóa chart thông qua backend
      const response = await fetch(`${API_URL}/charts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete chart');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting chart:', error);
      throw error;
    }
  },

  // Phương thức truy vấn trực tiếp Supabase (backup nếu API backend gặp vấn đề)
  async getChartsDirectly() {
    try {
      const { data, error } = await supabase
        .from('charts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { charts: data };
    } catch (error) {
      console.error('Error getting charts directly:', error);
      throw error;
    }
  }
};
export default chartService;