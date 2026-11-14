import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Cpu,
  ShieldCheck,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export function AuthLayout() {
  const { isDark, toggleTheme } = useContext(ThemeContext) || { isDark: false, toggleTheme: () => {} };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative overflow-hidden">
      {/* Ambient Radial Lighting for high-end feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Corporate Status Header */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">RELAY</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">AI</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400">Enterprise Workflow Intelligence</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Grid Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Normal</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-slate-500 dark:text-slate-400">99.99% SLA</span>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Centered Content Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="w-full max-w-xl">
          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-2xl dark:shadow-black/50 backdrop-blur-sm">
            <Outlet />
          </div>

          {/* Security & Compliance Assurance Footer */}
          <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              256-Bit TLS End-to-End Encryption
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              SOC-2 Type II Certified
            </span>
            <span>&bull;</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
