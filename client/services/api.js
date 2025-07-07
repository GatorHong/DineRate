import axios from 'axios';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';

const api = axios.create({
  baseURL: `http://${hostUri}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
