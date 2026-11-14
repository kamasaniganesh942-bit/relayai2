import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Plus,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

export function Header({ onMenuClick, title = 'Overview' }) {
  const { user, logout, login } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext) || { isDark: false, toggleTheme: () => {} };
  const { unreadCount } = useContext(NotificationContext) || { unreadCount: 0 };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickPersona = async (email) => {
    try {
      await login({ email, password: 'Demo123!' });
      setDropdownOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const roleName = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'org_admin' ? 'Org Admin'
    : user?.role === 'dept_manager' ? 'Dept Manager'
    : 'Employee';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Request Button */}
        <Button
          size="sm"
          onClick={() => navigate('/requests/new')}
          icon={Plus}
          className="shadow-xs text-xs font-semibold"
        >
          <span className="hidden sm:inline">New Request</span>
          <span className="sm:hidden">Request</span>
        </Button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Account Menu Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <Avatar
              name={`${user?.first_name || ''} ${user?.last_name || ''}`}
              src={user?.avatar_url || user?.avatarUrl}
              size="sm"
            />
            <div className="hidden md:block leading-none">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                {user?.first_name || 'Sarah'} {user?.last_name || 'Chen'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 capitalize mt-0.5 block">
                {roleName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs">
              {/* User Bio Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-slate-400 text-[11px] truncate">{user?.email}</div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Acme Corporation
                  </span>
                  <Badge variant="purple" size="sm">{roleName}</Badge>
                </div>
              </div>

              {/* Persona Switcher Quick Links */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Switch Enterprise Persona:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('admin@acme-demo.com')}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Sarah (VP Ops)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('michael.okonkwo@acme-demo.com')}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Michael (Finance)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('lisa.tanaka@acme-demo.com')}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Lisa (IT Lead)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPersona('david.park@acme-demo.com')}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    David (Engineer)
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account & Authorities</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Organization Governance</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
