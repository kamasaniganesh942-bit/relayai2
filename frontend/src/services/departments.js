import api from './api';

export const departmentsService = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  getMembers: (id) => api.get(`/departments/${id}/members`),
  addMember: (id, userId, role) => api.post(`/departments/${id}/members`, { user_id: userId, role }),
  removeMember: (id, userId) => api.delete(`/departments/${id}/members/${userId}`),
};

export default departmentsService;
