import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  User,
  Building2,
  Send,
  CheckCircle,
  FileCheck,
  Plus,
  AlertTriangle
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

export function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/requests/${id}`);
      const data = res.data?.data || res.data;
      setRequest(data);
      setNewStatus(data.status);

      // Fetch comments for this request
      const commRes = await api.get('/comments', {
        params: { entityType: 'request', entityId: id },
      });
      setComments(commRes.data?.data || commRes.data || []);
    } catch (err) {
      console.error('Error fetching request:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post('/comments', {
        entityType: 'request',
        entityId: id,
        content: newComment,
      });
      setNewComment('');
      // Refresh comments
      const commRes = await api.get('/comments', {
        params: { entityType: 'request', entityId: id },
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
      await api.put(`/requests/${id}`, { status: newStatus });
      setRequest((prev) => ({ ...prev, status: newStatus }));
      setStatusModalOpen(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Retrieving request dossier..." />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-16">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Request Not Found</h3>
        <Button className="mt-4" onClick={() => navigate('/requests')}>
          Back to All Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/requests')} icon={ArrowLeft}>
            Requests
          </Button>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(true)}>
            Update Status
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/tasks?requestId=${request.id}`)}
            icon={Plus}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Main Request Title Card */}
      <Card>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {request.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Category: <strong className="text-slate-700 dark:text-slate-300">{request.category || 'General'}</strong></span>
          <span>&bull;</span>
          <span>Submitted on: {new Date(request.created_at).toLocaleDateString()}</span>
          {request.deadline && (
            <>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Target Deadline: {new Date(request.deadline).toLocaleDateString()}
              </span>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </p>
        </div>
      </Card>

      {/* AI Semantic Classification Card */}
      {request.ai_classification && (
        <Card
          title="RELAY AI Classification & Routing Engine"
          subtitle="Comprehension metadata powered by Google Gemini"
          className="border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/20 to-transparent"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Request Category</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{request.ai_classification.category}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Urgency Assessment</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 capitalize">{request.ai_classification.urgency || 'Time Sensitive'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Suggested Department</span>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">{request.ai_classification.suggestedDepartment || 'Operations'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">AI Confidence</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {Math.round((request.ai_classification.confidence || 0.95) * 100)}%
              </p>
            </div>
          </div>
          <div className="pt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {request.ai_classification.suggestedAction && (
              <p><strong>Suggested Action:</strong> {request.ai_classification.suggestedAction}</p>
            )}
            {request.ai_classification.explanation && (
              <p><strong>Reasoning:</strong> {request.ai_classification.explanation}</p>
            )}
          </div>
        </Card>
      )}

      {/* Discussion & Activity Thread */}
      <Card title="Activity & Collaboration Thread" subtitle="Cross-department communication and audit trail">
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No comments yet. Start the conversation below.</p>
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
            placeholder="Add a remark, mention a teammate, or document progress..."
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" size="sm" loading={submittingComment} icon={Send}>
            Post
          </Button>
        </form>
      </Card>

      {/* Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Request Status"
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

export default RequestDetailPage;

