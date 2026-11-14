import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  KanbanSquare,
  List,
  Plus,
  Clock,
  AlertTriangle,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function TaskKanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { id: 'new', label: 'New / Backlog', color: 'border-slate-400' },
    { id: 'assigned', label: 'Assigned', color: 'border-indigo-500' },
    { id: 'in_progress', label: 'In Progress', color: 'border-blue-500' },
    { id: 'waiting_approval', label: 'Waiting Approval', color: 'border-amber-500' },
    { id: 'blocked', label: 'Blocked', color: 'border-red-500' },
    { id: 'completed', label: 'Completed', color: 'border-emerald-500' },
  ];

  const fetchKanbanTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks', { params: { limit: 100 } });
      const list = res.data?.data || res.data || [];
      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching kanban tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanTasks();
  }, []);

  const getColumnTasks = (colId) => {
    if (colId === 'new') {
      return tasks.filter((t) => t.status === 'new' || t.status === 'under_review');
    }
    return tasks.filter((t) => t.status === colId);
  };

  return (
    <div className="space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Workflow Kanban Board
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visual pipeline tracking stages from triage to completion.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* List vs Kanban View Toggle */}
          <div className="p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              List View
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-slate-100"
            >
              Kanban
            </button>
          </div>

          <Button size="sm" onClick={() => navigate('/tasks')} icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Arranging kanban board columns..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-xl p-3 flex flex-col min-w-[220px] max-h-[calc(100vh-210px)] border border-slate-200/70 dark:border-slate-800"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-2 mb-3 border-b-2 ${col.color}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{col.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 scrollbar-thin">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug">
                            {task.title}
                          </h4>
                          {task.is_blocked && (
                            <span title={task.block_reason || 'Blocked'} className="text-red-500 shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                          <PriorityBadge priority={task.priority} />
                          {task.deadline && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskKanbanPage;

