import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function DepartmentsManagementPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '' });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      const list = res.data?.data || res.data || [];
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', newDept);
      setCreateModalOpen(false);
      setNewDept({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (err) {
      console.error('Failed to create department:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Department Workspaces
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure business units, assign department managers, and define operational routing domains.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)} icon={Plus}>
          Add Department
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading department workspaces..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: dept.color || '#4f46e5' }}
                  >
                    {dept.code}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{dept.name}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Workspace</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {dept.description || 'General department workspace'}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Manager: <strong className="text-slate-700 dark:text-slate-300">Assigned</strong></span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
                  Configure &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Department"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Create Department
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="Department Name"
            placeholder="e.g. Quality Assurance & Testing"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            required
          />
          <Input
            label="Department Code"
            placeholder="e.g. QA"
            value={newDept.code}
            onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
            required
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mission / Description
            </label>
            <textarea
              rows={3}
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              placeholder="What responsibilities belong to this department..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DepartmentsManagementPage;

