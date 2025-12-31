import api from '../utils/api';

export const UserProfileService = {
  getAllUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },

  editUser: async (data: { mobileNumber: string; name: string }) => {
    const response = await api.put('/user/edit', data);
    return response.data;
  },

  createOrUpdateParishProfile: async (data: {
    userId: number;
    streetName: string;
    dateOfBirth: string;
    feastName: string;
  }) => {
    const response = await api.post('/api/parish-profile', data);
    return response.data;
  },

  getParishProfileByStreet: async (street: string) => {
    const response = await api.get(`/api/parish-profile/street/${street}`);
    return response.data;
  },

  getMyParishProfile: async () => {
    const response = await api.get('/api/parish-profile/me');
    return response.data;
  },
};
