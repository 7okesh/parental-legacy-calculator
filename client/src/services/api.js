import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const calculateOnServer = async (dob, dynamicSeed = false, customFactors = null) => {
  const res = await api.post('/calculator/calculate', { dob, dynamicSeed, customFactors });
  return res.data;
};

export const saveCalculationOnServer = async (calculationData) => {
  const res = await api.post('/calculator/save', calculationData);
  return res.data;
};

export const getHistoryFromServer = async () => {
  const res = await api.get('/calculator/history');
  return res.data;
};

export const loginApi = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerApi = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const uploadExcelApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/upload/excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export default api;
