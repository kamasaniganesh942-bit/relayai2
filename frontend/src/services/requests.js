import api from './api';

export const requestsService = {
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  getComments: (id) => api.get(`/requests/${id}/comments`),
  addComment: (id, content) => api.post(`/requests/${id}/comments`, { content }),
  getAttachments: (id) => api.get(`/requests/${id}/attachments`),
  uploadAttachment: (id, formData) =>
    api.post(`/requests/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default requestsService;
