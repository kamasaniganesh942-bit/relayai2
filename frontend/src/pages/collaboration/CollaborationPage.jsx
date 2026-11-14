import React, { useState, useEffect } from 'react';
import {
  Share2,
  Building2,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  FileText,
  Clock,
  Send
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import PriorityBadge from '../../components/ui/PriorityBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function CollaborationPage() {
  const [activeDept, setActiveDept] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollaborationData = async () => {
    try {
      setLoading(true);
      const [deptRes, taskRes] = await Promise.all([
        api.get('/departments'),
        api.get('/tasks', { params: { limit: 50 } }),
      ]);

      const deptList = deptRes.data?.data || deptRes.data || [];
      const taskList = taskRes.data?.data || taskRes.data || [];
      setDepartments(Array.isArray(deptList) ? deptList : []);
      setTasks(Array.isArray(taskList) ? taskList : []);
    } catch (err) {
      console.error('Failed to load collaboration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborationData();
  }, []);

  const deptTabs = [
    { id: 'all', label: 'All Departments' },
    ...departments.map((d) => ({ id: d.id, label: d.name })),
  ];

  const filteredTasks = activeDept === 'all'
    ? tasks
    : tasks.filter((t) => t.dept_id === activeDept);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Cross-Department Collaboration Center
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Bridge operational silos, monitor cross-department dependency handoffs, and share workspaces.
        </p>
      </div>

      {/* Cross-Department Dependency Highlights */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">Cross-Department Dependency Alert</h4>
          <p className="mt-0.5 leading-relaxed">
            <strong>IT Department</strong> is currently waiting for <strong>Finance PO Approval #88391</strong> before proceeding with workstation deployment.
          </p>
        </div>
      </div>

      {/* Department Workspace Tabs */}
      <Tabs tabs={deptTabs} activeTab={activeDept} onChange={setActiveDept} />

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Synchronizing cross-department records..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Workspaces Grid */}
          <div className="lg:col-span-2 space-y-4">
            <Card title="Shared Department Work Items" subtitle="Active tasks spanning departmental boundaries">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No tasks currently assigned to this department.</p>
                ) : (
                  filteredTasks.map((t) => (
                    <div key={t.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{t.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{t.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Department Roster and Activity */}
          <div className="space-y-4">
            <Card title="Department Hub" subtitle="Lead and active coverage">
              <div className="space-y-3">
                {departments.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{d.code}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationPage;

