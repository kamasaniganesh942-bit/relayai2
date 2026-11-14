import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Tabs from '../../components/ui/Tabs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggerEvent: 'request_created',
    action: 'notify_department_manager',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesRes, logsRes] = await Promise.all([
        api.get('/workflows'),
        api.get('/automation/logs'),
      ]);
      const ruleList = rulesRes.data?.data || rulesRes.data || [];
      const logList = logsRes.data?.data || logsRes.data || [];
      setRules(Array.isArray(ruleList) ? ruleList : []);
      setLogs(Array.isArray(logList) ? logList : []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleRule = async (rule) => {
    try {
      await api.put(`/workflows/${rule.id}`, { isActive: !rule.is_active });
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
      );
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workflows', {
        name: newRule.name,
        description: newRule.description,
        triggerEvent: newRule.triggerEvent,
        conditions: [{ field: 'priority', operator: 'equals', value: 'critical' }],
        actions: [{ action: newRule.action }],
        isActive: true,
      });
      setCreateModalOpen(false);
      setNewRule({ name: '', description: '', triggerEvent: 'request_created', action: 'notify_department_manager' });
      fetchData();
    } catch (err) {
      console.error('Failed to create workflow rule:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Workflow className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Workflow Automation Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build event-driven rules to automate request classification, manager alerts, and SLA triggers.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} icon={Plus}>
          New Automation Rule
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'rules', label: 'Active Rules', badge: rules.length },
          { id: 'logs', label: 'Execution Audit Logs', badge: logs.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading workflow registry..." />
        </div>
      ) : activeTab === 'rules' ? (
        <div className="space-y-4">
          {rules.length === 0 ? (
            <Card>
              <p className="text-xs text-slate-400 text-center py-6">No automation rules configured yet.</p>
            </Card>
          ) : (
            rules.map((rule) => (
              <Card key={rule.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rule.name}</h4>
                      <Badge variant={rule.is_active ? 'success' : 'default'} dot>
                        {rule.is_active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {rule.description || 'No description provided.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>Trigger: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{rule.trigger_event}</strong></span>
                      <span>&bull;</span>
                      <span>Executions: <strong className="text-slate-700 dark:text-slate-300">{rule.execution_count || 0} times</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleRule(rule)}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title={rule.is_active ? 'Pause Rule' : 'Activate Rule'}
                  >
                    {rule.is_active ? (
                      <ToggleRight className="w-7 h-7 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card title="Automation Execution Telemetry" subtitle="Deterministic audit trail of all triggered rules">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Event Trigger</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No execution logs recorded yet.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{log.rule_name || 'Standard Rule'}</td>
                      <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">{log.trigger_event}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">Executed</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{log.execution_duration_ms || 120}ms</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(log.executed_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Rule Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Automation Rule"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateRule}>
              Save Automation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Rule Name"
            placeholder="e.g. Critical IT Urgent Dispatch"
            value={newRule.name}
            onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              placeholder="What this automation does..."
            />
          </div>

          <Select
            label="Trigger Event (WHEN)"
            value={newRule.triggerEvent}
            onChange={(e) => setNewRule({ ...newRule, triggerEvent: e.target.value })}
            options={[
              { value: 'request_created', label: 'When a new request is submitted' },
              { value: 'task_overdue', label: 'When a task misses its deadline' },
              { value: 'priority_critical', label: 'When priority is classified as Critical' },
            ]}
          />

          <Select
            label="Action (THEN)"
            value={newRule.action}
            onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
            options={[
              { value: 'notify_department_manager', label: 'Notify Department Manager & Escalate' },
              { value: 'create_approval_request', label: 'Create Formal Approval Gate' },
              { value: 'set_sla_hours', label: 'Enforce 4-Hour Critical SLA' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default WorkflowsPage;

