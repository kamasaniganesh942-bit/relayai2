import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Building,
  User,
  Filter,
  Check,
  X
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';

export function ApprovalsPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionModal, setActionModal] = useState({ open: false, type: '', item: null });
  const [decisionNote, setDecisionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/approvals', {
        params: { status: filter, all: 'true' },
      });
      const list = res.data?.data || res.data || [];
      setApprovals(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filter]);

  const handleProcessApproval = async () => {
    if (!actionModal.item) return;
    setSubmitting(true);
    try {
      await api.put(`/approvals/${actionModal.item.id}`, {
        status: actionModal.type === 'approve' ? 'approved' : 'rejected',
        decisionNote: decisionNote || (actionModal.type === 'approve' ? 'Approved in accordance with budget policy.' : 'Rejected due to cost ceiling.'),
      });
      setActionModal({ open: false, type: '', item: null });
      setDecisionNote('');
      fetchApprovals();
    } catch (err) {
      console.error('Failed to process approval:', err);
    } finally {
      setSubmitting(false);
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
              Executive Decision & Approval Gates
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorize capital procurement requests, budget line item releases, and cross-department governance gates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Exposure Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Pending Approval Volume
          </span>
          <span className="text-2xl font-black text-amber-500">
            {approvals.filter((a) => a.status === 'pending').length} Gates
          </span>
        </Card>

        <Card padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Capital Exposure (Pending)
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            $18,500.00
          </span>
        </Card>

        <Card padding="sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Sign-off Speed
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            4.2 Hours
          </span>
        </Card>
      </div>

      {/* Approvals Feed */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Querying corporate approval registry..." />
        </div>
      ) : approvals.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title={`No ${filter} approvals`}
          description={`There are currently no items under the ${filter} queue.`}
        />
      ) : (
        <div className="space-y-4">
          {approvals.map((app) => (
            <Card key={app.id} className="p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{app.title}</h4>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    {app.amount > 0 && (
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        Amount: ${Number(app.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>Requested on: {new Date(app.created_at).toLocaleDateString()}</span>
                    {app.decision_notes && (
                      <>
                        <span>&bull;</span>
                        <span className="text-slate-600 dark:text-slate-300 italic">
                          "{app.decision_notes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionModal({ open: true, type: 'reject', item: app })}
                      className="border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50"
                      icon={X}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActionModal({ open: true, type: 'approve', item: app })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                      icon={Check}
                    >
                      Authorize Sign-off
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, type: '', item: null })}
        title={actionModal.type === 'approve' ? 'Authorize Business Sign-Off' : 'Reject Requisition Gate'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setActionModal({ open: false, type: '', item: null })}>
              Cancel
            </Button>
            <Button
              size="sm"
              loading={submitting}
              onClick={handleProcessApproval}
              variant={actionModal.type === 'approve' ? 'primary' : 'danger'}
            >
              {actionModal.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {actionModal.type === 'approve'
              ? 'Authorizing this gate will unblock downstream department tasks and dispatch automated approval notifications.'
              : 'Rejecting this item will return the requisition to the submitter with your documented justification.'}
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Decision Note / Justification
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder={actionModal.type === 'approve' ? 'e.g. Approved within Q3 software license budget.' : 'e.g. Exceeds department threshold. Please resubmit with revised quote.'}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ApprovalsPage;

