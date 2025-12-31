import api from '../utils/api';

export const GeneralService = {
  getAllNotifications: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  createNotification: async (title: string, message: string) => {
    const response = await api.post('/api/notifications', null, {
      params: { title, message },
    });
    return response.data;
  },

  deleteNotification: async (id: number) => {
    const response = await api.delete(`/api/notifications/${id}`);
    return response.data;
  },

  getMonthlyPdf: async (month: string, year: number) => {
    const response = await api.get('/api/monthly-pdf', {
      params: { month, year },
    });
    return response.data;
  },

  uploadMonthlyPdf: async (month: string, year: number, file: any) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    const response = await api.post('/api/monthly-pdf', formData, {
      params: { month, year },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAllMonthlyPdfs: async () => {
    const response = await api.get('/api/monthly-pdf/all');
    return response.data;
  },

  updateAltarSchedule: async (
    id: number,
    data: {
      serviceDate: string;
      altarBoys: string;
      readers: string;
      choirMembers: string;
    },
  ) => {
    const response = await api.put(`/api/altar-schedule/${id}`, data);
    return response.data;
  },

  getAllAltarSchedules: async () => {
    const response = await api.get('/api/altar-schedule');
    return response.data;
  },

  createAltarSchedule: async (data: {
    serviceDate: string;
    altarBoys: string;
    readers: string;
    choirMembers: string;
  }) => {
    const response = await api.post('/api/altar-schedule', data);
    return response.data;
  },

  getAltarScheduleByDate: async (date: string) => {
    const response = await api.get(`/api/altar-schedule/${date}`);
    return response.data;
  },

  getBirthdaysToday: async () => {
    const response = await api.get('/api/birthdays/today');
    return response.data;
  },

  getBirthdaysByMonth: async (month: number) => {
    const response = await api.get(`/api/birthdays/month/${month}`);
    return response.data;
  },
};
