// backend-server/controllers/chartController.js
const supabase = require('../config/supabase');
const { calculateChart } = require('../services/astroService');

exports.createChart = async (req, res) => {
  try {
    const { name, birth_date, birth_time, birth_place, latitude, longitude, timezone } = req.body;
    
    // Validate input
    if (!name || !birth_date || !birth_time || !birth_place || !latitude || !longitude || !timezone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate astrological data
    const chartData = await calculateChart({
      birth_date,
      birth_time,
      latitude,
      longitude,
      timezone
    });

    // Save to Supabase
    const { data, error } = await supabase
      .from('charts')
      .insert([
        {
          name,
          birth_date,
          birth_time,
          birth_place,
          latitude,
          longitude,
          timezone,
          chart_data: chartData
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save chart data' });
    }

    return res.status(201).json({ 
      message: 'Chart created successfully',
      chart: data
    });
  } catch (error) {
    console.error('Error creating chart:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getChart = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Chart not found' });
    }

    return res.json({ chart: data });
  } catch (error) {
    console.error('Error fetching chart:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getCharts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch charts' });
    }

    return res.json({ charts: data });
  } catch (error) {
    console.error('Error fetching charts:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteChart = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(404).json({ error: 'Chart not found or could not be deleted' });
    }

    return res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    console.error('Error deleting chart:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
