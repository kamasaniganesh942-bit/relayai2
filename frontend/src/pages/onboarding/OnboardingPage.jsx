import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users2,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [orgDetails, setOrgDetails] = useState({
    industry: 'Software & Technology',
    size: '100-500 employees',
    primaryGoal: 'Cross-department request resolution',
  });

  const [selectedDepts, setSelectedDepts] = useState([
    'Human Resources',
    'Finance & Accounting',
    'Information Technology',
    'Operations & Logistics',
    'Sales & Marketing',
  ]);

  const [aiSettings, setAiSettings] = useState({
    autoRouting: true,
    confidenceThreshold: '85%',
    slaEnforcement: true,
  });

  const toggleDept = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Progress Stepper */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Setup Wizard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configure RELAY AI for Your Organization
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Step {step} of 4 — {step === 1 ? 'Organization Profile' : step === 2 ? 'Department Workspaces' : step === 3 ? 'AI Routing Rules' : 'Ready to Launch'}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 max-w-xs mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-indigo-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Organization Details */}
        {step === 1 && (
          <Card className="bg-slate-950/80 border-slate-800 p-8 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Company Profile</h3>
            <p className="text-xs text-slate-400 mb-6">Tell us about your organization to optimize Gemini routing models.</p>

            <div className="space-y-4">
              <Select
                label="Primary Industry"
                value={orgDetails.industry}
                onChange={(e) => setOrgDetails({ ...orgDetails, industry: e.target.value })}
                options={[
                  'Software & Technology',
                  'Finance & Banking',
                  'Healthcare & Biotech',
                  'Manufacturing & Logistics',
                  'Retail & E-Commerce',
                  'Professional Services',
                ]}
              />

              <Select
                label="Company Size"
                value={orgDetails.size}
                onChange={(e) => setOrgDetails({ ...orgDetails, size: e.target.value })}
                options={[
                  '1-50 employees',
                  '51-200 employees',
                  '201-1000 employees',
                  '1000+ enterprise',
                ]}
              />

              <Select
                label="Primary Operational Objective"
                value={orgDetails.primaryGoal}
                onChange={(e) => setOrgDetails({ ...orgDetails, primaryGoal: e.target.value })}
                options={[
                  'Cross-department request resolution',
                  'Procurement and expense approval gates',
                  'IT support dispatch and ticketing',
                  'Predictive operational bottleneck prevention',
                ]}
              />
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)}>
                Continue to Departments
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Departments */}
        {step === 2 && (
          <Card className="bg-slate-950/80 border-slate-800 p-8 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Enable Department Workspaces</h3>
            <p className="text-xs text-slate-400 mb-6">Select the business units where requests and tasks will be routed.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { name: 'Human Resources', code: 'HR', desc: 'Onboarding, leave, benefits' },
                { name: 'Finance & Accounting', code: 'FIN', desc: 'Budgets, POs, expenses' },
                { name: 'Information Technology', code: 'IT', desc: 'Hardware, software, access' },
                { name: 'Operations & Logistics', code: 'OPS', desc: 'Facilities, supply chain' },
                { name: 'Sales & Marketing', code: 'SALES', desc: 'Collateral, leads, client prep' },
                { name: 'Legal & Compliance', code: 'LEGAL', desc: 'Contracts, NDA review' },
              ].map((dept) => {
                const selected = selectedDepts.includes(dept.name);
                return (
                  <div
                    key={dept.name}
                    onClick={() => toggleDept(dept.name)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-3 select-none ${
                      selected
                        ? 'bg-indigo-950/50 border-indigo-500/80 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border ${
                      selected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-700 bg-slate-800'
                    }`}>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{dept.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{dept.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue to AI Rules
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: AI Rules */}
        {step === 3 && (
          <Card className="bg-slate-950/80 border-slate-800 p-8 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">AI Intelligence Configuration</h3>
            <p className="text-xs text-slate-400 mb-6">Tune automated routing confidence thresholds and SLA monitoring.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Autonomous Request Routing</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Let Gemini assign requests directly to department leads when confidence is high.</p>
                </div>
                <input
                  type="checkbox"
                  checked={aiSettings.autoRouting}
                  onChange={(e) => setAiSettings({ ...aiSettings, autoRouting: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Continuous Bottleneck Detection</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Alert managers when approvals or tasks stall across department dependencies.</p>
                </div>
                <input
                  type="checkbox"
                  checked={aiSettings.slaEnforcement}
                  onChange={(e) => setAiSettings({ ...aiSettings, slaEnforcement: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep(2)} icon={ArrowLeft}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Finalize Setup
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Finished */}
        {step === 4 && (
          <Card className="bg-slate-950/80 border-slate-800 p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white">Workspace Ready!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              Your organization has been configured with {selectedDepts.length} departments and AI workflow automation active.
            </p>

            <div className="mt-8">
              <Button size="lg" onClick={handleFinish} className="shadow-xl">
                Open Executive Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 mt-8">
        &copy; {new Date().getFullYear()} RELAY AI — Enterprise Workflow Intelligence Platform
      </div>
    </div>
  );
}

export default OnboardingPage;

