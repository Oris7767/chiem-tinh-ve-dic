const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Lấy thông tin kết nối từ biến môi trường
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Sử dụng service_role key cho backend

// Kiểm tra xem các biến môi trường có tồn tại không
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Khởi tạo Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
