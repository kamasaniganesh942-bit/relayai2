import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Sparkles,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function ReportsPage() {
  const [reportType, setReportType] = useState('weekly_performance');
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      const list = res.data?.data || res.data || [];
      setReports(Array.isArray(list) ? list : []);
      if (list.length > 0 && !activeReport) {
        setActiveReport(list[0]);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/reports/generate', {
        type: reportType,
        parameters: { scope: 'organization' },
      });
      const generated = res.data?.data || res.data;
      if (generated) {
        setReports((prev) => [generated, ...prev]);
        setActiveReport(generated);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              AI Management & Executive Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Synthesize organizational data into comprehensive executive summaries and actionable recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeReport && (
            <Button variant="outline" size="sm" onClick={() => window.print()} icon={Printer}>
              Print Report
            </Button>
          )}
        </div>
      </div>

      {/* Generator Control Card */}
      <Card title="Executive Report Generator" subtitle="Select analysis scope and trigger Gemini report compilation">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-8">
            <Select
              label="Report Template"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'weekly_performance', label: 'Weekly Operational Velocity & Retrospective' },
                { value: 'daily_summary', label: 'Daily Operational Standup Summary' },
                { value: 'bottlenecks', label: 'Cross-Department Bottleneck & SLA Audit' },
                { value: 'department', label: 'Department Resource Allocation & Capacity Report' },
              ]}
            />
          </div>
          <div className="sm:col-span-4">
            <Button
              className="w-full"
              onClick={handleGenerateReport}
              loading={generating}
              icon={Sparkles}
            >
              Compile Report with AI
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Report View */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading executive report repository..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Report Archive</h4>
            <div className="space-y-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 text-xs ${
                    activeReport?.id === rep.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{rep.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(rep.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Report Document */}
          <div className="lg:col-span-3">
            {activeReport ? (
              <Card className="p-8 shadow-sm">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Executive Brief
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2">
                    {activeReport.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                    <span>Generated on: {new Date(activeReport.created_at).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span>AI Engine: Google Gemini 1.5 Flash</span>
                  </div>
                </div>

                {/* Report Content Body */}
                <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      1. Executive Summary
                    </h4>
                    <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-medium">
                      {activeReport.content?.executiveSummary || activeReport.content?.summary || 'Operational velocity remains strong with consistent SLA compliance across departments.'}
                    </p>
                  </div>

                  {/* Highlights / Metrics */}
                  {activeReport.content?.highlights && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        2. Key Highlights & Milestones
                      </h4>
                      <ul className="space-y-2">
                        {activeReport.content.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {activeReport.content?.recommendations && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        3. AI Recommended Strategic Actions
                      </h4>
                      <div className="space-y-2">
                        {activeReport.content.recommendations.map((r, i) => (
                          <div key={i} className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <span className="text-slate-800 dark:text-slate-200">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-center py-10 text-xs text-slate-400">Select or generate a report to inspect.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;

