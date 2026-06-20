import api from './api';

export const login = async (password) => {
  const response = await api.post('/api/auth/login', { password });
  return response.data;
};
