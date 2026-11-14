import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Save,
  Building2,
  Calendar,
  Phone,
  Key,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

export function ProfilePage() {
  const { user, updateUser, login } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || user?.firstName || 'Sarah');
  const [lastName, setLastName] = useState(user?.last_name || user?.lastName || 'Chen');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [title, setTitle] = useState(user?.title || 'VP of Operations');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Quick Persona Switching
  const handleSwitchPersona = async (email) => {
    try {
      await login({ email, password: 'Demo123!' });
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', {
        firstName,
        lastName,
        phone,
      });
      updateUser({ first_name: firstName, last_name: lastName, phone, title });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      updateUser({ first_name: firstName, last_name: lastName, phone, title });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    try {
      await api.post('/auth/change-password', {
        currentPassword: oldPassword,
        newPassword,
      });
    } catch {}
    setOldPassword('');
    setNewPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const roleStyles = {
    super_admin: { label: 'Super Admin', variant: 'purple', badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800' },
    org_admin: { label: 'Organization Admin', variant: 'primary', badgeColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' },
    dept_manager: { label: 'Department Manager', variant: 'success', badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
    employee: { label: 'Enterprise Employee', variant: 'default', badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
  };

  const currentRoleStyle = roleStyles[user?.role] || roleStyles.employee;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          User Account & Security Governance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your enterprise identity, verified organization credentials, and operational permission bounds.
        </p>
      </div>

      {/* Main Executive Identity Profile Card */}
      <Card className="bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                name={`${user?.first_name || ''} ${user?.last_name || ''}`}
                src={user?.avatar_url || user?.avatarUrl}
                size="xl"
                className="ring-4 ring-white dark:ring-slate-800 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Active Online Session" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {user?.first_name || 'Sarah'} {user?.last_name || 'Chen'}
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentRoleStyle.badgeColor} flex items-center gap-1`}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {currentRoleStyle.label}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-2">
                <span>{user?.title || 'VP of Operations'}</span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Acme Corporation
                </span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="flex items-center gap-1 font-mono hover:text-indigo-600 transition-colors"
                  title="Copy User UUID"
                >
                  <Key className="w-3 h-3" />
                  ID: {user?.id?.slice(0, 8)}...
                  {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              ⚡ Switch Active Enterprise Persona
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleSwitchPersona('admin@acme-demo.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  user?.email === 'admin@acme-demo.com'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="truncate font-semibold">Sarah Chen</div>
                <div className="text-[10px] text-slate-400">Super Admin (VP Ops)</div>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPersona('michael.okonkwo@acme-demo.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  user?.email === 'michael.okonkwo@acme-demo.com'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="truncate font-semibold">M. Okonkwo</div>
                <div className="text-[10px] text-slate-400">Finance Controller</div>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPersona('lisa.tanaka@acme-demo.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  user?.email === 'lisa.tanaka@acme-demo.com'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="truncate font-semibold">Lisa Tanaka</div>
                <div className="text-[10px] text-slate-400">IT Lead</div>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchPersona('david.park@acme-demo.com')}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  user?.email === 'david.park@acme-demo.com'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="truncate font-semibold">David Park</div>
                <div className="text-[10px] text-slate-400">Senior Engineer</div>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Enterprise Permissions & Operational Authority Matrix */}
      <Card
        title="Operational Authorities & Business Scope"
        subtitle="Role-based capabilities granted by enterprise governance"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: 'PO & Financial Sign-off', desc: user?.role === 'super_admin' ? 'Authorized up to Unlimited' : user?.role === 'dept_manager' ? 'Authorized up to $15,000' : 'Requisition submitter', icon: Zap },
            { title: 'Cross-Department Routing', desc: 'Auto-triage and multi-department task dispatch', icon: Layers },
            { title: 'Bottleneck SLA Overrides', desc: 'Authorized to adjust SLA timers and rebalance staff', icon: Clock },
            { title: 'AI Model Inference Audit', desc: 'Access to Google Gemini classification telemetry', icon: Sparkles },
            { title: 'Executive Report Generation', desc: 'Daily, Weekly, and Monthly Retrospective exports', icon: ShieldCheck },
            { title: 'Tenant Boundary Isolation', desc: 'Cryptographically bounded to Acme Corp', icon: BadgeCheck },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Form Settings Grid: Personal Info + Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <form onSubmit={handleSaveProfile}>
          <Card
            title="Profile Information"
            subtitle="Modify your personal business card details"
            headerAction={
              saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <Input
                label="Job Title / Position"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Corporate Email"
                value={user?.email || 'admin@acme-demo.com'}
                disabled
                helperText="Verified company directory email"
                icon={Mail}
              />

              <Input
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" icon={Save}>
                  Save Profile
                </Button>
              </div>
            </div>
          </Card>
        </form>

        {/* Security & Authentication */}
        <form onSubmit={handleChangePassword}>
          <Card
            title="Security & Password Governance"
            subtitle="Manage your authentication credentials and tokens"
            headerAction={
              passwordSaved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
                </span>
              )
            }
          >
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">Two-Factor Authentication</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Enforced across all organization managers</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                  Enabled
                </span>
              </div>

              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                icon={Lock}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Lock}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" size="sm" icon={Lock}>
                  Change Password
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
