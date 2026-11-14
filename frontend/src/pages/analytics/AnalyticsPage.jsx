import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [dashRes, perfRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/department-performance'),
      ]);
      setData(dashRes.data?.data || dashRes.data);
      setPerformance(perfRes.data?.data || perfRes.data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Calculating organizational metrics and velocity..." />
      </div>
    );
  }

  const trendsData = [
    { name: 'W1', completed: 14, incoming: 18 },
    { name: 'W2', completed: 22, incoming: 24 },
    { name: 'W3', completed: 29, incoming: 28 },
    { name: 'W4', completed: 35, incoming: 31 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Enterprise Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Department SLA compliance, resolution time distribution, and request throughput.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => window.print()} icon={Download}>
          Export PDF
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <span className="text-xs text-slate-500 block mb-1">Completion Rate</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {data?.completionRate || 92}%
          </span>
        </Card>
        <Card padding="sm">
          <span className="text-xs text-slate-500 block mb-1">Avg Resolution Hours</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {data?.avgResolutionHours || 18.5}h
          </span>
        </Card>
        <Card padding="sm">
          <span className="text-xs text-slate-500 block mb-1">Open Tasks</span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
            {data?.openTasks || 0}
          </span>
        </Card>
        <Card padding="sm">
          <span className="text-xs text-slate-500 block mb-1">Overdue Items</span>
          <span className="text-2xl font-black text-red-600 dark:text-red-400">
            {data?.overdueTasks || 0}
          </span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <Card title="Monthly Request Velocity" subtitle="Work items completed vs incoming">
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="completed" stroke="#4f46e5" strokeWidth={2.5} name="Completed" />
                <Line type="monotone" dataKey="incoming" stroke="#06b6d4" strokeWidth={2} name="Incoming" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Pie Chart */}
        <Card title="Priority Distribution" subtitle="Workload by urgency category">
          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.priorityDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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

      {/* Department Performance Table */}
      <Card title="Department SLA & Performance Audit" subtitle="Efficiency metrics broken down by operational unit">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Tasks</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Overdue</th>
                <th className="py-3 px-4">SLA Compliance</th>
                <th className="py-3 px-4">Avg Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {performance.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{dept.name}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{dept.totalTasks}</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">{dept.completedTasks}</td>
                  <td className="py-3 px-4 text-red-500 font-semibold">{dept.overdueTasks}</td>
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">{dept.slaCompliance}%</td>
                  <td className="py-3 px-4 text-slate-500">{dept.avgHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsPage;

