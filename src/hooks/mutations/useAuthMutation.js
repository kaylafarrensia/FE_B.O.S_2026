import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API } from '@/lib/API';

export default function useAuthMutation() {
  const queryClient = useQueryClient();

  const handleLoginSuccess = (response) => {
    const token = response?.token || response?.data?.token;
    if (token) {
      window.localStorage.setItem('token', token);
    }
    const user = response?.user || response?.data?.user || response?.data || {};
    queryClient.setQueryData([QUERY_KEYS.USER], {
      data: { data: user },
    });
  };

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post('/auth/signin', payload);
      return res.data;
    },
    onSuccess: handleLoginSuccess,
    onError: (err) => {
      console.error('Login error', err);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post('/auth/signup', payload);
      return res.data;
    },
    onError: (err) => {
      console.error('Register error', err);
    },
  });


  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post('/admin/forgot-password', payload);
      return res.data;
    },
    onError: (err) => {
      console.error('Forgot password error', err);
    },
  });

  const getResetPasswordMutation = useMutation({
    mutationFn: async (params) => {
      const res = await API.get('/auth/reset-password', { params });
      return res.data;
    },
    onError: (err) => {
      console.error('Get reset password error', err);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post('/auth/reset-password', payload);
      return res.data;
    },
    onError: (err) => {
      console.error('Reset password error', err);
    },
  });

  return {

    loginMutation,
    registerMutation,
    forgotPasswordMutation,
    getResetPasswordMutation,
    resetPasswordMutation,
  };
}
