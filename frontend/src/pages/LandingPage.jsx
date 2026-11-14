import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ArrowRight,
  Sparkles,
  Bot,
  Workflow,
  BarChart3,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle,
  Zap,
  Users,
  Building
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async () => {
    try {
      await login({ email: 'admin@acme-demo.com', password: 'Demo123!' });
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">RELAY AI</span>
              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                Enterprise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-slate-300 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={handleQuickDemoLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              Explore Live Demo
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Autonomous Enterprise Workflow Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Connecting People, Departments and Decisions <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              Through Intelligence.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            RELAY AI acts as the operational nervous system for your entire organization. Powered by Google Gemini, it comprehends complex business requests, automates routing, predicts bottlenecks, and guides leadership decisions.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleQuickDemoLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 shadow-xl shadow-indigo-600/25"
            >
              Start Free Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm px-6 py-3"
            >
              Register Organization
            </Button>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="mt-8 p-3 max-w-xl mx-auto rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span className="font-semibold text-slate-300">⚡ Demo Credential:</span>
            <span>Email: <strong className="text-indigo-400">admin@acme-demo.com</strong></span>
            <span>Password: <strong className="text-indigo-400">Demo123!</strong></span>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Request Visibility</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">84%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Faster SLA Resolution</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-violet-400">0</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Forgotten Tasks</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">10x</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Leadership Visibility</div>
          </div>
        </div>
      </section>

      {/* 6 Core Product Pillars */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Architectural Modules</h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            An Autonomous Operating System for Organizations
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            RELAY AI bridges employees, managers, HR, Finance, IT, Sales, and Executives into a unified coordination framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Semantic Request Understanding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini analyses incoming business descriptions, extracts urgency, deduces priority, assigns SLA, and formulates actionable next steps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Intelligent Department Routing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically maps tickets to the best department based on team member workloads, open requests, skills, and organizational rules.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Bottleneck & Delay Forecasting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuously monitors multi-stage workflows, detecting delayed approvals, dependencies, and calculating probability of missed deadlines.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <Workflow className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Automated Workflow Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create configurable triggers, conditions, and actions. Automate reminders, manager escalations, approval gates, and notifications.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">RELAY INTELLIGENCE Assistant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conversational executive assistant querying authenticated organizational records. Ask about bottlenecks, velocity, or weekly team output.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Automated Management Reports</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate daily summaries, weekly retrospectives, and monthly bottleneck audits complete with executive takeaways and recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">RELAY AI</span>
            <span>— The Enterprise Workflow Intelligence Platform</span>
          </div>
          <div>
            Built with React, Express, Supabase PostgreSQL, and Google Gemini API.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

