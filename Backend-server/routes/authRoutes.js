
const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await supabaseService.signIn(email, password);
    res.json(data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Đăng xuất
router.post('/logout', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
