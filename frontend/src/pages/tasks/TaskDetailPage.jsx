import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  Building,
  AlertTriangle,
  CheckCircle2,
  Send,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Avatar from '../../components/ui/Avatar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${id}`);
      const data = res.data?.data || res.data;
      setTask(data);
      setNewStatus(data.status);

      // Fetch comments for this task
      const commRes = await api.get('/comments', {
        params: { entityType: 'task', entityId: id },
      });
      setComments(commRes.data?.data || commRes.data || []);
    } catch (err) {
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post('/comments', {
        entityType: 'task',
        entityId: id,
        content: newComment,
      });
      setNewComment('');
      // Refresh comments
      const commRes = await api.get('/comments', {
        params: { entityType: 'task', entityId: id },
      });
      setComments(commRes.data?.data || commRes.data || []);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTask((prev) => ({ ...prev, status: newStatus }));
      setStatusModalOpen(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Retrieving task specifications..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-16">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Task Not Found</h3>
        <Button className="mt-4" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')} icon={ArrowLeft}>
            Tasks
          </Button>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(true)}>
            Update Status
          </Button>
          {task.status !== 'completed' && (
            <Button
              size="sm"
              onClick={async () => {
                await api.put(`/tasks/${id}`, { status: 'completed' });
                setTask((prev) => ({ ...prev, status: 'completed' }));
              }}
              icon={CheckCircle2}
            >
              Mark Completed
            </Button>
          )}
        </div>
      </div>

      {/* Blocked Alert Banner if blocked */}
      {task.is_blocked && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <div>
            <h4 className="font-bold text-sm text-red-800 dark:text-red-200">Task Execution is Blocked</h4>
            <p className="mt-0.5 leading-relaxed">{task.block_reason || 'Waiting on dependent approvals or external resources.'}</p>
          </div>
        </div>
      )}

      {/* Main Task Card */}
      <Card>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {task.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {task.deadline && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Target Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
          <span>&bull;</span>
          <span>Est. Hours: <strong className="text-slate-700 dark:text-slate-300">{task.estimated_hours || 0}h</strong></span>
          <span>&bull;</span>
          <span>Logged: <strong className="text-slate-700 dark:text-slate-300">{task.actual_hours || 0}h</strong></span>
          {task.request_id && (
            <>
              <span>&bull;</span>
              <Link to={`/requests/${task.request_id}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                Originating Request
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description & Work Scope</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {task.description || 'No detailed instructions provided.'}
          </p>
        </div>
      </Card>

      {/* Comments & Activity Thread */}
      <Card title="Task Discussion & Activity" subtitle="Collaborate on implementation steps">
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No comments logged for this task.</p>
          ) : (
            comments.map((comm) => (
              <div key={comm.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <Avatar name="Colleague" size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Team Member</span>
                    <span className="text-[10px] text-slate-400">{new Date(comm.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{comm.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add an update or report blockers..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" size="sm" loading={submittingComment} icon={Send}>
            Post Update
          </Button>
        </form>
      </Card>

      {/* Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Task Status"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdateStatus}>
              Save Status
            </Button>
          </>
        }
      >
        <Select
          label="New Status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={[
            { value: 'new', label: 'New' },
            { value: 'under_review', label: 'Under Review' },
            { value: 'assigned', label: 'Assigned' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'waiting_approval', label: 'Waiting for Approval' },
            { value: 'blocked', label: 'Blocked' },
            { value: 'completed', label: 'Completed' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </Modal>
    </div>
  );
}

export default TaskDetailPage;

