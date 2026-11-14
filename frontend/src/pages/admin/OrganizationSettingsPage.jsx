import React, { useState } from 'react';
import {
  Settings,
  Building,
  Cpu,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export function OrganizationSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    orgName: 'Acme Corporation',
    slug: 'acme-demo',
    industry: 'Technology & Manufacturing',
    aiModel: 'gemini-1.5-flash',
    autoAssignment: true,
    criticalSlaHours: 4,
    highSlaHours: 12,
    mediumSlaHours: 48,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Organization Settings & AI Policies
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global configuration for tenant boundary, SLA thresholds, and Gemini AI inference models.
          </p>
        </div>

        {saved && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Info */}
        <Card title="Organization Identity" subtitle="General company information and tenant slug">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              value={settings.orgName}
              onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
            />
            <Input
              label="Tenant Slug"
              value={settings.slug}
              disabled
              helperText="Unique identifier for multi-tenant database isolation"
            />
            <Input
              label="Industry Sector"
              value={settings.industry}
              onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
            />
          </div>
        </Card>

        {/* AI Model & Routing Engine */}
        <Card title="Google Gemini AI Engine Configuration" subtitle="Model parameter tuning and autonomous routing rules">
          <div className="space-y-4">
            <Select
              label="Primary AI Inference Model"
              value={settings.aiModel}
              onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
              options={[
                { value: 'gemini-1.5-flash', label: 'Google Gemini 1.5 Flash (Ultra-fast, Recommended)' },
                { value: 'gemini-1.5-pro', label: 'Google Gemini 1.5 Pro (Deep Contextual Reasoning)' },
              ]}
            />

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Autonomous Request Routing</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Automatically assign requests to department leads when AI classification confidence exceeds 85%.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAssignment}
                onChange={(e) => setSettings({ ...settings, autoAssignment: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
            </div>
          </div>
        </Card>

        {/* SLA Hours Enforcement */}
        <Card title="SLA Hours Thresholds" subtitle="Define maximum expected resolution turnaround before automated escalation">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Critical Priority SLA (Hours)"
              type="number"
              value={settings.criticalSlaHours}
              onChange={(e) => setSettings({ ...settings, criticalSlaHours: Number(e.target.value) })}
            />
            <Input
              label="High Priority SLA (Hours)"
              type="number"
              value={settings.highSlaHours}
              onChange={(e) => setSettings({ ...settings, highSlaHours: Number(e.target.value) })}
            />
            <Input
              label="Medium Priority SLA (Hours)"
              type="number"
              value={settings.mediumSlaHours}
              onChange={(e) => setSettings({ ...settings, mediumSlaHours: Number(e.target.value) })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="md" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default OrganizationSettingsPage;

