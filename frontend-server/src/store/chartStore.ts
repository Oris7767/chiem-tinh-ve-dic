import { create } from 'zustand';
import api from '../lib/api';

interface ChartData {
  id?: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isPublic?: boolean;
  chart_data?: any;
}

interface ChartState {
  charts: ChartData[];
  currentChart: ChartData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserCharts: () => Promise<void>;
  getChartById: (id: string) => Promise<void>;
  calculateChart: (chartData: ChartData) => Promise<any>;
  saveChart: (chartData: ChartData) => Promise<void>;
  updateChart: (id: string, chartData: Partial<ChartData>) => Promise<void>;
  deleteChart: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  charts: [],
  currentChart: null,
  isLoading: false,
  error: null,

  fetchUserCharts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/charts/user');
      set({ charts: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch charts',
        isLoading: false,
      });
    }
  },

  getChartById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/charts/${id}`);
      set({ currentChart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch chart',
        isLoading: false,
      });
    }
  },

  calculateChart: async (chartData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/charts/calculate', chartData);
      set({ isLoading: false });
      return response.data.chart;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to calculate chart',
        isLoading: false,
      });
      return null;
    }
  },

  saveChart: async (chartData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/charts/save', chartData);
      // Cập nhật danh sách charts
      const { charts } = get();
      set({
        charts: [...charts, response.data.savedChart],
        currentChart: response.data.savedChart,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to save chart',
        isLoading: false,
      });
    }
  },

  updateChart: async (id, chartData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/charts/${id}`, chartData);
      // Cập nhật danh sách charts
      const { charts } = get();
      set({
        charts: charts.map(chart => chart.id === id ? response.data : chart),
        currentChart: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update chart',
        isLoading: false,
      });
    }
  },

  deleteChart: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/charts/${id}`);
      // Cập nhật danh sách charts
      const { charts, currentChart } = get();
      set({
        charts: charts.filter(chart => chart.id !== id),
        currentChart: currentChart?.id === id ? null : currentChart,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete chart',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
