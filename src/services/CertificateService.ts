import api from '../utils/api';

export const CertificateService = {
  requestCertificate: async (data: {
    certificateType: string;
    remarks?: string;
  }) => {
    const response = await api.post('/api/certificates/request', data);
    return response.data;
  },

  uploadCertificate: async (id: number, file: any) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    const response = await api.post(
      `/api/certificates/${id}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  getAllCertificates: async () => {
    const response = await api.get('/api/certificates');
    return response.data;
  },

  getMyCertificates: async () => {
    const response = await api.get('/api/certificates/me');
    return response.data;
  },
};
