
const supabaseService = require('../services/supabaseService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const data = await supabaseService.signIn(email, password);
      res.json(data);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message || 'Invalid credentials' });
    }
  }
  
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, birthDate } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Đăng ký người dùng
      const authData = await supabaseService.signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      
      // Nếu đăng ký thành công và không cần xác nhận email
      if (authData.user && !authData.user.identities?.[0]?.identity_data?.email_verified) {
        // Tạo profile cho người dùng
        await supabaseService.updateProfile(authData.user.id, {
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate
        });
      }
      
      res.status(201).json({
        message: 'Registration successful',
        user: authData.user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }
}

module.exports = new AuthController();
