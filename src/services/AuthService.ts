import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export const AuthService = {
  login: async (data: { mobileNumber: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: {
    name: string;
    mobileNumber: string;
    password: string;
    email: string;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  requestPasswordReset: async (data: { email: string }) => {
    const response = await api.post('/auth/request-password-reset', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  refreshToken: async (data: { refreshToken: string }) => {
    const response = await api.post('/auth/refresh', data);
    return response.data;
  },

  updateRole: async (data: { mobileNumber: string; roles: string }) => {
    const response = await api.post('/auth/update-role', data);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
  },
};
