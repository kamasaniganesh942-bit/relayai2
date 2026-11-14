import api from './api';

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRequestAnalytics: (params) => api.get('/analytics/requests', { params }),
  getTaskAnalytics: (params) => api.get('/analytics/tasks', { params }),
  getDepartmentAnalytics: (params) => api.get('/analytics/departments', { params }),
  getPerformanceMetrics: (params) => api.get('/analytics/performance', { params }),
  exportReport: (params) => api.get('/analytics/export', { params, responseType: 'blob' }),
};

export default analyticsService;
