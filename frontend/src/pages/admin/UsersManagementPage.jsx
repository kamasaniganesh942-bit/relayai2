import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Mail,
  ShieldCheck,
  Building,
  UserCheck,
  Search,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee',
    title: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      const list = res.data?.data || res.data || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setAddModalOpen(false);
      setNewUser({ firstName: '', lastName: '', email: '', role: 'employee', title: '' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    const matchesSearch = !search || fullName.includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      header: 'Team Member',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.first_name || ''} ${row.last_name || ''}`} src={row.avatar_url} size="sm" />
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{row.first_name} {row.last_name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => (
        <Badge variant={row.role === 'super_admin' || row.role === 'org_admin' ? 'purple' : row.role === 'dept_manager' ? 'primary' : 'default'}>
          {row.role?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Title / Position',
      key: 'title',
      render: (row) => <span className="text-xs text-slate-600 dark:text-slate-300">{row.title || 'Staff'}</span>,
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (row) => (
        <Badge variant={row.is_active !== false ? 'success' : 'default'} dot>
          {row.is_active !== false ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Employee & Access Control
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage organization members, assign role permissions, and track active team seats.
          </p>
        </div>

        <Button onClick={() => setAddModalOpen(true)} icon={Plus}>
          Add Team Member
        </Button>
      </div>

      {/* Toolbar */}
      <Card padding="sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by employee name or email..."
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="All Roles"
              options={[
                { value: '', label: 'All Roles' },
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'org_admin', label: 'Organization Admin' },
                { value: 'dept_manager', label: 'Department Manager' },
                { value: 'employee', label: 'Employee' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading team roster..." />
        </div>
      ) : (
        <Table columns={columns} data={filteredUsers} />
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Invite New Team Member"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddUser}>
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Corporate Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />

          <Input
            label="Job Title"
            placeholder="e.g. Lead QA Engineer"
            value={newUser.title}
            onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
          />

          <Select
            label="Access Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              { value: 'employee', label: 'Employee (Standard Submissions)' },
              { value: 'dept_manager', label: 'Department Manager (Approvals & Task Assignment)' },
              { value: 'org_admin', label: 'Organization Admin' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default UsersManagementPage;

