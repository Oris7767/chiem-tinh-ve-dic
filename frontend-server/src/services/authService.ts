import api from '../lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  [key: string]: any;
}

interface AuthResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user: {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    // Lưu token vào localStorage
    localStorage.setItem('accessToken', response.data.session.access_token);
    localStorage.setItem('refreshToken', response.data.session.refresh_token);
    
    return response.data;
  },
  
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/users', data);
    return response.data;
  },
  
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
  
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
};
