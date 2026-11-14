import api from './api';

export const workflowsService = {
  getAll: (params) => api.get('/workflows', { params }),
  getById: (id) => api.get(`/workflows/${id}`),
  create: (data) => api.post('/workflows', data),
  update: (id, data) => api.put(`/workflows/${id}`, data),
  delete: (id) => api.delete(`/workflows/${id}`),
  toggleActive: (id) => api.patch(`/workflows/${id}/toggle`),
  getLogs: (id, params) => api.get(`/workflows/${id}/logs`, { params }),
};

export default workflowsService;
