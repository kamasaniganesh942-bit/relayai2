import api from './api';

export const aiService = {
  analyzeRequest: (requestId) => api.post(`/ai/analyze/${requestId}`),
  analyzeText: (text) => api.post('/ai/analyze', { text }),
  askAssistant: (message, context) => api.post('/ai/assistant', { message, context }),
  getConversationHistory: () => api.get('/ai/assistant/history'),
  clearConversationHistory: () => api.delete('/ai/assistant/history'),
  getInsights: (params) => api.get('/ai/insights', { params }),
  generateReport: (params) => api.post('/ai/reports/generate', params),
  getReports: () => api.get('/ai/reports'),
  getReportById: (id) => api.get(`/ai/reports/${id}`),
};

export default aiService;
