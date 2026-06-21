import api from './api';

export const getPromotions = async () => {
  const response = await api.get('/api/promotions/');
  return response.data;
};

export const createPromotion = async (promotionData) => {
  const response = await api.post('/api/promotions/', promotionData);
  return response.data;
};

export const deletePromotion = async (id) => {
  const response = await api.delete(`/api/promotions/${id}`);
  return response.data;
};
