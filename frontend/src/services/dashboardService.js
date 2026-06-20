import api from './api';

export const getDashboard = async () => {
  const response = await api.get('/api/dashboard');
  return response.data;
};

export const getForecast = async () => {
  const response = await api.get('/api/dashboard/forecast');
  return response.data;
};
