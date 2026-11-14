import api from './api';

export const approvalsService = {
  getAll: (params) => api.get('/approvals', { params }),
  getById: (id) => api.get(`/approvals/${id}`),
  getPending: () => api.get('/approvals/pending'),
  approve: (id, note) => api.post(`/approvals/${id}/approve`, { decision_note: note }),
  reject: (id, note) => api.post(`/approvals/${id}/reject`, { decision_note: note }),
  getHistory: (params) => api.get('/approvals/history', { params }),
};

export default approvalsService;
