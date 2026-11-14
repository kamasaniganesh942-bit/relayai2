import React from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  KanbanSquare,
  FileText,
  Sparkles,
  Bot,
  TrendingUp,
  Share2,
  Workflow,
  BarChart3,
  FileCheck,
  Bell,
  Users,
  Building2,
  Settings,
  LogOut,
  Cpu,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/ui/Avatar';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin, isManager } = useAuth();
  const location = useLocation();
  const navigate = useRouterNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSection = (title, items) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </RouterNavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">RELAY</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">AI</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">Enterprise Intelligence</p>
          </div>
        </div>

        {/* Navigation scrollable */}
        <div className="p-3.5 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
          {navSection('Core Workflows', [
            { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { label: 'Decision Approvals', path: '/approvals', icon: FileCheck, badge: 'Gate' },
            { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
            { label: 'Kanban View', path: '/tasks/kanban', icon: KanbanSquare },
            { label: 'All Requests', path: '/requests', icon: FileText },
          ])}

          {navSection('AI Intelligence', [
            { label: 'Request Analysis', path: '/ai/analysis', icon: Sparkles, badge: 'AI' },
            { label: 'RELAY Assistant', path: '/ai/assistant', icon: Bot, badge: 'Live' },
            { label: 'Operational Insights', path: '/ai/insights', icon: TrendingUp },
          ])}

          {navSection('Collaboration & Operations', [
            { label: 'Collaboration Center', path: '/collaboration', icon: Share2 },
            { label: 'Workflow Automation', path: '/workflows', icon: Workflow },
            { label: 'Enterprise Analytics', path: '/analytics', icon: BarChart3 },
            { label: 'Executive Reports', path: '/reports', icon: FileCheck },
            { label: 'Notifications', path: '/notifications', icon: Bell },
          ])}

          {(isAdmin || isManager) && navSection('Administration', [
            { label: 'Team Members', path: '/admin/users', icon: Users },
            { label: 'Departments', path: '/admin/departments', icon: Building2 },
            { label: 'Organization Settings', path: '/admin/settings', icon: Settings },
          ])}
        </div>
      </div>

      {/* User profile bottom bar */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shadow-xs">
          <RouterNavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity">
            <Avatar name={`${user?.first_name || ''} ${user?.last_name || ''}`} src={user?.avatar_url} size="sm" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-slate-400 capitalize mt-0.5 truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </RouterNavLink>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
