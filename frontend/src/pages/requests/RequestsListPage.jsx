import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, FileText, Search, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
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

export function RequestsListPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests', {
        params: {
          page,
          limit: 15,
          search: search || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        },
      });

      const list = res.data?.data || res.data || [];
      setRequests(Array.isArray(list) ? list : []);
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalCount(res.data.pagination.total || list.length);
      } else {
        setTotalCount(list.length);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter, priorityFilter]);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const columns = [
    {
      header: 'Request Title',
      key: 'title',
      render: (row) => (
        <div className="max-w-md">
          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.title}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {row.category || 'General'}
        </span>
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
        if (!row.deadline) return <span className="text-slate-400 text-xs">No deadline</span>;
        const isPast = new Date(row.deadline) < new Date();
        return (
          <span className={`text-xs font-medium ${isPast && row.status !== 'completed' ? 'text-red-500 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}>
            {new Date(row.deadline).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      header: 'Created',
      key: 'created_at',
      render: (row) => (
        <span className="text-xs text-slate-400">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Enterprise Business Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit, track, analyze, and coordinate multi-department employee requests.
          </p>
        </div>
        <Button onClick={() => navigate('/requests/new')} icon={Plus}>
          Submit New Request
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <Card padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Search request titles or content..."
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
                { value: 'under_review', label: 'Under Review' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'waiting_approval', label: 'Waiting Approval' },
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

      {/* Table Data */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner message="Loading request items..." />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No requests match criteria"
          description="Try adjusting your filters, or submit a new business request."
          actionLabel="Submit Request"
          onAction={() => navigate('/requests/new')}
        />
      ) : (
        <div className="space-y-4">
          <Table
            columns={columns}
            data={requests}
            onRowClick={(row) => navigate(`/requests/${row.id}`)}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}

export default RequestsListPage;

