import api from '../utils/api';

export const MassIntentionService = {
  getAll: async () => {
    const response = await api.get('/api/mass-intentions');
    return response.data;
  },

  create: async (data: {
    intentionFor: string;
    intentionDate: string;
    description: string;
  }) => {
    const response = await api.post('/api/mass-intentions', data);
    return response.data;
  },

  getMyIntentions: async () => {
    const response = await api.get('/api/mass-intentions/me');
    return response.data;
  },

  reject: async (id: number) => {
    const response = await api.put(`/api/mass-intentions/${id}/reject`);
    return response.data;
  },

  pay: async (id: number) => {
    const response = await api.put(`/api/mass-intentions/${id}/pay`);
    return response.data;
  },

  approve: async (id: number) => {
    const response = await api.put(`/api/mass-intentions/${id}/approve`);
    return response.data;
  },
};
