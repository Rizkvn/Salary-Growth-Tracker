import api from './api';

export const getSalaries = async () => {
  const response = await api.get('/api/salaries/');
  return response.data;
};

export const createSalary = async (salaryData) => {
  const response = await api.post('/api/salaries/', salaryData);
  return response.data;
};

export const deleteSalary = async (id) => {
  const response = await api.delete(`/api/salaries/${id}`);
  return response.data;
};
