import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BadgeCheck,
  Key,
  Users,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'personas'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersona, setLoadingPersona] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid corporate credentials. Verify email and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, personaId) => {
    setEmail(demoEmail);
    setPassword('Demo123!');
    setError('');
    setLoadingPersona(personaId);
    try {
      await login({ email: demoEmail, password: 'Demo123!' });
      navigate('/dashboard');
    } catch (err) {
      setError('Demo authentication failed. Ensure backend service is reachable.');
    } finally {
      setLoadingPersona(null);
    }
  };

  const handleSSO = async () => {
    // Quick corporate SSO simulation (authenticates as Sarah Chen via Okta / SAML protocol)
    setLoading(true);
    setError('');
    try {
      await login({ email: 'admin@acme-demo.com', password: 'Demo123!' });
      navigate('/dashboard');
    } catch (err) {
      setError('SSO Gateway timed out.');
    } finally {
      setLoading(false);
    }
  };

  const personas = [
    {
      id: 'sarah',
      name: 'Sarah Chen',
      email: 'admin@acme-demo.com',
      role: 'Super Admin',
      title: 'VP of Operations',
      dept: 'Operations & Strategy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      desc: 'Full administrative authority, SLA overrides, executive analytics, and AI governance.',
    },
    {
      id: 'michael',
      name: 'Michael Okonkwo',
      email: 'michael.okonkwo@acme-demo.com',
      role: 'Dept Manager',
      title: 'Finance Controller',
      dept: 'Finance & Procurement',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      desc: 'Purchase order sign-offs, capital expenditure gates, and budget authorization.',
    },
    {
      id: 'lisa',
      name: 'Lisa Tanaka',
      email: 'lisa.tanaka@acme-demo.com',
      role: 'Dept Manager',
      title: 'IT Lead',
      dept: 'Information Technology',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
      desc: 'Infrastructure deployments, hardware triage, security access, and incident response.',
    },
    {
      id: 'david',
      name: 'David Park',
      email: 'david.park@acme-demo.com',
      role: 'Employee',
      title: 'Senior Engineer',
      dept: 'IT & Engineering',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      desc: 'Request submission, task updates, kanban board execution, and peer comments.',
    },
  ];

  return (
    <div>
      {/* Workspace & Tenant Badge */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block leading-tight">
              Acme Corporation Workspace
            </span>
            <span className="text-[10px] text-slate-400 font-mono">acme-demo.relay.internal</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Verified Tenant
        </span>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Enterprise Sign In
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Authenticate using your corporate credentials or choose a pre-configured enterprise role.
        </p>
      </div>

      {/* Tabs: Credentials vs Instant Personas */}
      <div className="flex p-1 mb-6 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <button
          type="button"
          onClick={() => setActiveTab('credentials')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'credentials'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Corporate Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('personas')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'personas'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          1-Click Demo Personas
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
          <div className="shrink-0 mt-0.5">&bull;</div>
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Corporate Credentials */}
      {activeTab === 'credentials' && (
        <div>
          {/* SSO Button */}
          <button
            type="button"
            onClick={handleSSO}
            disabled={loading}
            className="w-full mb-4 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-colors shadow-xs"
          >
            <Fingerprint className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Sign in with Enterprise SSO / Okta SAML
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or email credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Corporate Email Address"
              type="email"
              placeholder="sarah.chen@acme-demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For this demo workspace, password for all seeded accounts is: Demo123!')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Remember this workstation for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full shadow-lg shadow-indigo-600/20 text-sm py-2.5 mt-2 font-bold"
            >
              Sign In to Platform
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>
      )}

      {/* Tab 2: 1-Click Executive Personas */}
      {activeTab === 'personas' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Click any role card to instantly authenticate and experience RELAY AI through that executive perspective:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickDemo(p.email, p.id)}
                disabled={loadingPersona !== null}
                className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left group flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={p.name} src={p.avatar} size="md" className="shrink-0 mt-0.5" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {p.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.role}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                      {p.title} &bull; {p.dept}
                    </div>

                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  {loadingPersona === p.id ? (
                    <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-400 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Demo Footer hint for Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Quick 1-Click Role Login:
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('personas')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-[11px]"
            >
              View All Personas &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@acme-demo.com', 'quick-sarah')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-slate-900 dark:text-slate-100 truncate">Sarah Chen</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">Super Admin (VP Ops)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('michael.okonkwo@acme-demo.com', 'quick-michael')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-slate-900 dark:text-slate-100 truncate">Michael Okonkwo</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">Finance Controller</div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Link to Register */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Registering a new organization?{' '}
        <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
          Create Corporate Tenant &rarr;
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
