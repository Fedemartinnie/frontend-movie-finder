import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.6:8000',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting auth token from AsyncStorage', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
