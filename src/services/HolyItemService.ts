import api from '../utils/api';

export const HolyItemService = {
  available: async () => {
    const response = await api.get('/api/holy-items');
    return response.data;
  },

  add: async (data: {
    itemName: string;
    stock: number;
    available: boolean;
    availabilityDate?: string;
    description?: string;
  }) => {
    const response = await api.post('/api/holy-items', data);
    return response.data;
  },

  updateStock: async (id: number, stock: number) => {
    const response = await api.put(`/api/holy-items/${id}/stock/${stock}`);
    return response.data;
  },

  placeOrder: async (data: { holyItemId: number; quantity: number }) => {
    const response = await api.post('/api/holy-items/order', data);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/api/holy-items/orders');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/api/holy-items/orders/me');
    return response.data;
  },
};
