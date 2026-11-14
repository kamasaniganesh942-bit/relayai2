import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';

import DashboardPage from './pages/DashboardPage';
import ApprovalsPage from './pages/approvals/ApprovalsPage';
import TasksListPage from './pages/tasks/TasksListPage';
import TaskKanbanPage from './pages/tasks/TaskKanbanPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';

import RequestsListPage from './pages/requests/RequestsListPage';
import NewRequestPage from './pages/requests/NewRequestPage';
import RequestDetailPage from './pages/requests/RequestDetailPage';

import AIAnalysisPage from './pages/ai/AIAnalysisPage';
import AIAssistantPage from './pages/ai/AIAssistantPage';
import AIInsightsPage from './pages/ai/AIInsightsPage';

import CollaborationPage from './pages/collaboration/CollaborationPage';
import WorkflowsPage from './pages/workflows/WorkflowsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ReportsPage from './pages/analytics/ReportsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

import UsersManagementPage from './pages/admin/UsersManagementPage';
import DepartmentsManagementPage from './pages/admin/DepartmentsManagementPage';
import OrganizationSettingsPage from './pages/admin/OrganizationSettingsPage';
import ProfilePage from './pages/ProfilePage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                borderRadius: '10px',
                fontSize: '13px',
                border: '1px solid #334155',
              },
            }}
          />
          <Routes>
            {/* Public Landing & Marketing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Onboarding Wizard */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Enterprise Workspace */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />

              {/* Tasks */}
              <Route path="/tasks" element={<TasksListPage />} />
              <Route path="/tasks/kanban" element={<TaskKanbanPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />

              {/* Requests */}
              <Route path="/requests" element={<RequestsListPage />} />
              <Route path="/requests/new" element={<NewRequestPage />} />
              <Route path="/requests/:id" element={<RequestDetailPage />} />

              {/* AI Intelligence */}
              <Route path="/ai/analysis" element={<AIAnalysisPage />} />
              <Route path="/ai/assistant" element={<AIAssistantPage />} />
              <Route path="/ai/insights" element={<AIInsightsPage />} />

              {/* Operations & Analytics */}
              <Route path="/collaboration" element={<CollaborationPage />} />
              <Route path="/workflows" element={<WorkflowsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Administration & Settings */}
              <Route path="/admin/users" element={<UsersManagementPage />} />
              <Route path="/admin/departments" element={<DepartmentsManagementPage />} />
              <Route path="/admin/settings" element={<OrganizationSettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

