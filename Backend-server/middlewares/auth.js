
const supabase = require('../config/supabase');

/**
 * Middleware xác thực JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Xác thực token với Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    // Lưu thông tin user vào request
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = { authenticate };
