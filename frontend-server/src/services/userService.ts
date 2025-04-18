import api from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

interface UserQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: {
    column: string;
    ascending: boolean;
  };
  [key: string]: any;
}

export const userService = {
  async getUsers(options: UserQueryOptions = {}): Promise<User[]> {
    const { page, limit, orderBy, ...filters } = options;
    
    // Xây dựng query params
    const params = new URLSearchParams();
    
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    if (orderBy !== undefined) params.append('orderBy', JSON.stringify(orderBy));
    
    // Thêm các filter khác
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value.toString());
    });
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },
  
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
