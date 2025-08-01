import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';

const api = axios.create({
  baseURL: `http://${hostUri}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Attach token to every request automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
