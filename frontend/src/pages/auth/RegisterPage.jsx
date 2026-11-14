import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({
        organizationName: formData.organizationName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/onboarding');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please verify your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Register your organization
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Set up an enterprise workspace and deploy AI workflow intelligence.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Organization Name"
          placeholder="e.g. Apex Technologies Inc."
          value={formData.organizationName}
          onChange={(e) => handleChange('organizationName', e.target.value)}
          icon={Building}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            icon={User}
            required
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>

        <Input
          label="Work Email"
          type="email"
          placeholder="john.doe@company.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={Mail}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={Lock}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full shadow-md text-sm py-2.5 mt-2"
        >
          Create Enterprise Account
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;

