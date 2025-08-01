import axios from 'axios';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';

const api = axios.create({
  baseURL: `http://${hostUri}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchLogs = async (type, token) => {
  const res = await api.get('/logs', {
    params: { type },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchLogById = async (id, token) => {
  const res = await api.get(`/logs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export default api;