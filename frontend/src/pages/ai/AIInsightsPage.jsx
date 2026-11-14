import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Layers,
  BarChart3
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function AIInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/insights');
      const data = res.data?.data || res.data;
      setInsights(data);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const sampleBottlenecks = [
    {
      area: 'Finance Procurement Approval Gate',
      severity: 'critical',
      impact: 'Blocking 4 IT deployment workstations',
      description: 'Average approval turnaround in Finance is 32 hours. Two PO sign-offs for hardware licenses have exceeded scheduled SLA.',
      recommendation: 'Configure auto-approval policy for hardware requisitions under $2,000.'
    },
    {
      area: 'IT Infrastructure Onboarding Provisioning',
      severity: 'high',
      impact: '2 new hires onboarded with pending AWS & Slack accesses',
      description: 'Manual credential setup is causing delayed developer velocity in week 1.',
      recommendation: 'Enable automated SSO SCIM provisioning in Workflow Rules.'
    }
  ];

  const sampleDelayPredictions = [
    {
      taskTitle: 'Audit Salesforce License Usage',
      riskScore: 88,
      riskLevel: 'critical',
      delayDays: 3,
      reason: 'Cross-department dependency pending on Finance VP sign-off',
      mitigation: 'Escalate to Finance Controller Michael Okonkwo for emergency sign-off'
    },
    {
      taskTitle: 'Quarterly SOC2 Security Access Review',
      riskScore: 65,
      riskLevel: 'high',
      delayDays: 1.5,
      reason: 'Workload concentration on Senior Developer David Park',
      mitigation: 'Reassign credential audit tasks to Marcus Brody'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Operational Intelligence & Bottleneck Detection
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Proactive pattern detection, cross-department dependency delays, and predictive timeline analysis.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchInsights} icon={RefreshCw}>
          Re-Analyze Workflows
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Scanning organizational workflow topologies for bottlenecks..." />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Health Metric Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Executive Assessment</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Moderate Risk Detected
                </span>
              </div>
              <h3 className="text-xl font-bold leading-tight">
                Two Active Multi-Department Blockers Identified
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Primary workflow constraint lies at the intersection of IT Procurement and Finance PO Sign-off. Resolving this will restore 94% on-time SLA velocity across the organization.
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400">92%</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Time SLA</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400">2</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Stalled Approvals</div>
              </div>
            </div>
          </div>

          {/* Bottlenecks Grid */}
          <Card title="Detected Operational Bottlenecks" subtitle="Issues with high friction or repeated delays across departments">
            <div className="space-y-4">
              {sampleBottlenecks.map((b, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${b.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.area}</h4>
                      <Badge variant={b.severity === 'critical' ? 'danger' : 'warning'}>
                        {b.severity}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {b.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        <strong>Impact:</strong> {b.impact}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        💡 Recommendation: {b.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delay Predictions */}
          <Card title="Predictive Task Delay Forecasts" subtitle="Tasks statistically susceptible to missing scheduled deadlines">
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Task Name</th>
                    <th className="py-3 px-4">Risk Probability</th>
                    <th className="py-3 px-4">Estimated Slip</th>
                    <th className="py-3 px-4">Root Factor</th>
                    <th className="py-3 px-4">Recommended Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sampleDelayPredictions.map((pred, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{pred.taskTitle}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-red-500">{pred.riskScore}%</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">+{pred.delayDays} days</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{pred.reason}</td>
                      <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium">{pred.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AIInsightsPage;

