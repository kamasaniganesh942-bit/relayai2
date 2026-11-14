import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/dashboard');
      setData(res.data?.data || res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Could not load real-time analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" message="Aggregating enterprise operational metrics..." />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Requests',
      value: data?.totalRequests ?? 0,
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Open Tasks',
      value: data?.openTasks ?? 0,
      icon: Layers,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/60',
    },
    {
      title: 'Completed Tasks',
      value: data?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Overdue Items',
      value: data?.overdueTasks ?? 0,
      icon: Clock,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/60',
    },
    {
      title: 'Pending Approvals',
      value: data?.pendingApprovals ?? 0,
      icon: FileCheck,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Operational Intelligence Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status across organizational requests, department pipelines, and bottlenecks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} icon={RefreshCw}>
            Refresh
          </Button>
          <Button size="sm" onClick={() => navigate('/requests/new')} icon={Plus}>
            Submit Request
          </Button>
        </div>
      </div>

      {/* AI Proactive Insight Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-700/50 shadow-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/40 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">RELAY AI Insight</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">Active</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Finance procurement reviews currently average 24h approval turnaround. Consider raising auto-approval threshold to <strong>$2,000</strong> to unblock 4 dependent IT deployment tasks.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/ai/insights')}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs shrink-0 self-start sm:self-center"
        >
          View Bottleneck Analysis
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} padding="sm" className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{stat.title}</span>
                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Trends Chart */}
        <Card title="Task Velocity & Trends" subtitle="Incoming requests vs completion rate" className="lg:col-span-2">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.completionTrends || []}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" name="Completed Tasks" />
                <Area type="monotone" dataKey="created" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" name="Incoming Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution Pie */}
        <Card title="Priority Breakdown" subtitle="Distribution of active workload">
          <div className="h-64 sm:h-72 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.priorityDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.priorityDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department Workloads & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workload Bar Chart */}
        <Card title="Department Workload" subtitle="Active vs resolved tasks per unit">
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentWorkload || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="activeTasks" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Active Tasks" />
                <Bar dataKey="completedTasks" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Requests Table Card */}
        <Card
          title="Recent Business Requests"
          subtitle="Real-time employee requests pipeline"
          headerAction={
            <Button variant="ghost" size="sm" onClick={() => navigate('/requests')}>
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {(!data?.recentRequests || data.recentRequests.length === 0) ? (
              <p className="text-xs text-slate-500 py-6 text-center">No recent requests recorded.</p>
            ) : (
              data.recentRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => navigate(`/requests/${req.id}`)}
                  className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {req.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {req.category || 'General'} &bull; {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;

