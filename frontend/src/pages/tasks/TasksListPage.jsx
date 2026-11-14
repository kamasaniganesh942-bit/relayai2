import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckSquare,
  KanbanSquare,
  Plus,
  Clock,
  User,
  Building,
  Filter,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

export function TasksListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', estimatedHours: 2 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks', {
        params: {
          page,
          limit: 15,
          search: search || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          requestId: searchParams.get('requestId') || undefined,
        },
      });

      const list = res.data?.data || res.data || [];
      setTasks(Array.isArray(list) ? list : []);
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalCount(res.data.pagination.total || list.length);
      } else {
        setTotalCount(list.length);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, searchParams]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        estimatedHours: Number(newTask.estimatedHours),
        requestId: searchParams.get('requestId') || null,
      });
      setCreateModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', estimatedHours: 2 });
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err);
    }
  };

  const columns = [
    {
      header: 'Task & Details',
      key: 'title',
      render: (row) => (
        <div className="max-w-md">
          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
            {row.title}
            {row.is_blocked && (
              <span className="p-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" title="Task is Blocked">
                <AlertTriangle className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {row.description || 'No description provided'}
          </div>
        </div>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Deadline',
      key: 'deadline',
      render: (row) => {
        if (!row.deadline) return <span className="text-slate-400 text-xs">Unscheduled</span>;
        const isPast = new Date(row.deadline) < new Date();
        return (
          <span className={`text-xs font-medium ${isPast && row.status !== 'completed' ? 'text-red-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
            {new Date(row.deadline).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      header: 'Est. Hours',
      key: 'estimated_hours',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.estimated_hours || 0}h
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Tasks & Work Assignments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage granular work items, cross-department dependencies, and team execution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* List vs Kanban View Toggle */}
          <div className="p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 flex items-center">
            <button
              type="button"
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-slate-100"
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks/kanban')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Kanban
            </button>
          </div>

          <Button onClick={() => setCreateModalOpen(true)} icon={Plus}>
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <Card padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search task title or description..."
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              placeholder="All Statuses"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'new', label: 'New' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'waiting_approval', label: 'Waiting for Approval' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              placeholder="All Priorities"
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Task Table */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner message="Loading task registry..." />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Create your first task or change your query filters."
          actionLabel="Create Task"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          <Table
            columns={columns}
            data={tasks}
            onRowClick={(row) => navigate(`/tasks/${row.id}`)}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
        description="Add a task with deadline, priority, and estimated workload."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateTask}>
              Create Task
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Audit Salesforce licenses"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Task Description
            </label>
            <textarea
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              placeholder="Add implementation instructions or acceptance criteria..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />

            <Input
              label="Estimated Hours"
              type="number"
              min="0.5"
              step="0.5"
              value={newTask.estimatedHours}
              onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TasksListPage;

