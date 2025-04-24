// src/services/chartService.js
import { supabase } from '../integrations/supabase/client';

export const chartService = {
  async getCharts() {
    try {
      const { data, error } = await supabase.functions.invoke('get-chart-data');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching charts:', error);
      throw new Error('Failed to fetch charts');
    }
  },

  async getChartDetail(chartId) {
    try {
      const { data, error } = await supabase.functions.invoke('get-chart-detail', {
        queryParams: { id: chartId }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching chart detail:', error);
      throw new Error('Failed to fetch chart details');
    }
  },

  async saveChart(chartData) {
    try {
      const { data, error } = await supabase.functions.invoke('save-chart', {
        method: 'POST',
        body: { chart: chartData }
      });
      
      if (error) throw error;
      
      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to save chart');
      }
      
      return data;
    } catch (error) {
      console.error('Error saving chart:', error);
      throw error;
    }
  }
};
