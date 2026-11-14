import api from './api';

export const tasksService = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  getComments: (id) => api.get(`/tasks/${id}/comments`),
  addComment: (id, content) => api.post(`/tasks/${id}/comments`, { content }),
  getDependencies: (id) => api.get(`/tasks/${id}/dependencies`),
  addDependency: (id, dependsOnTaskId) =>
    api.post(`/tasks/${id}/dependencies`, { depends_on_task_id: dependsOnTaskId }),
};

export default tasksService;
