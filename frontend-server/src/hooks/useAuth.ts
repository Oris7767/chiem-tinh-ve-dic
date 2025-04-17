import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Lưu user vào query cache
      queryClient.setQueryData(['user', data.user.id], data.user);
      navigate('/dashboard');
    }
  });
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login');
    }
  });
  
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Xóa cache
      queryClient.clear();
      navigate('/login');
    }
  });
  
  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
}
