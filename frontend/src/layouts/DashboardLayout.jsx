import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.startsWith('/approvals')) return 'Executive Decision & Approval Gates';
    if (path.startsWith('/tasks/kanban')) return 'Task Kanban Board';
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path.startsWith('/tasks')) return 'My Tasks & Assignments';
    if (path.startsWith('/requests/new')) return 'Submit Business Request';
    if (path.startsWith('/requests/')) return 'Request Overview';
    if (path.startsWith('/requests')) return 'Enterprise Requests';
    if (path.startsWith('/ai/analysis')) return 'AI Request Understanding';
    if (path.startsWith('/ai/assistant')) return 'RELAY INTELLIGENCE Assistant';
    if (path.startsWith('/ai/insights')) return 'Operational Bottlenecks & Risk';
    if (path.startsWith('/collaboration')) return 'Cross-Department Workspaces';
    if (path.startsWith('/workflows')) return 'Workflow Automation Engine';
    if (path.startsWith('/analytics')) return 'Enterprise Operational Analytics';
    if (path.startsWith('/reports')) return 'AI Executive & Management Reports';
    if (path.startsWith('/notifications')) return 'Notification Center';
    if (path.startsWith('/admin/users')) return 'Employee & Role Management';
    if (path.startsWith('/admin/departments')) return 'Department Administration';
    if (path.startsWith('/admin/settings')) return 'Organization Settings';
    if (path.startsWith('/profile')) return 'My Account & Preferences';
    return 'Executive Overview';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Persistent / Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

