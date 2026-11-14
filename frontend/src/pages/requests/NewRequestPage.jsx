import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PriorityBadge from '../../components/ui/PriorityBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function NewRequestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [aiClassification, setAiClassification] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAIAnalyze = async () => {
    if (!description.trim() && !title.trim()) {
      setError('Please enter a request title or description before analyzing.');
      return;
    }
    setError('');
    setAnalyzing(true);

    try {
      const textToAnalyze = `${title}\n\n${description}`;
      const res = await api.post('/ai/analyze', { text: textToAnalyze });
      const analysis = res.data?.data?.data || res.data?.data || res.data;

      if (analysis) {
        setAiClassification(analysis);
        // Pre-populate fields based on AI suggestions
        if (analysis.category) setCategory(analysis.category);
        if (analysis.priority) setPriority(analysis.priority.toLowerCase());
        if (analysis.relevantDeadline && !deadline) {
          try {
            setDeadline(new Date(analysis.relevantDeadline).toISOString().slice(0, 10));
          } catch {}
        }
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      setError('AI analysis temporarily unavailable. You can still submit manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title,
        description,
        category,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        ai_classification: aiClassification,
      };

      const res = await api.post('/requests', payload);
      const created = res.data?.data || res.data;
      navigate(`/requests/${created.id || ''}`);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadExample = (exTitle, exDesc) => {
    setTitle(exTitle);
    setDescription(exDesc);
    setAiClassification(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/requests')} icon={ArrowLeft}>
          Back
        </Button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Submit Business Request
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit an employee request with intelligent Google Gemini classification and automated department routing.
          </p>
        </div>
      </div>

      {/* Preset Examples Pill Bar */}
      <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-600 dark:text-slate-400">💡 Quick Test Scenarios:</span>
        <button
          type="button"
          onClick={() => loadExample(
            'Broken Laptop Before Executive Pitch',
            'My laptop suddenly stopped working and I have an important client presentation tomorrow at 2 PM. Need loaner device and slide restoration.'
          )}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs"
        >
          Broken Laptop (IT)
        </button>
        <button
          type="button"
          onClick={() => loadExample(
            'Salesforce 15-Seat Expansion PO Approval',
            'Contract renewal is due next week. We need to add 15 additional sales rep seats for newly hired team members. Total cost $18,500.'
          )}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 text-xs"
        >
          Budget Approval (Finance)
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Request Details" subtitle="Describe the operational request in natural language">
          <div className="space-y-4">
            <Input
              label="Request Title"
              placeholder="e.g. Critical Workstation Hardware Crash"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is needed, any upcoming deadlines, dependencies, or client impact..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* AI Analyze Trigger Button */}
            <div className="pt-1 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIAnalyze}
                loading={analyzing}
                icon={Sparkles}
                className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                Comprehend with RELAY AI
              </Button>
              <span className="text-[11px] text-slate-400">
                Gemini will infer priority, department, and actions
              </span>
            </div>
          </div>
        </Card>

        {/* Live AI Analysis Insight Card */}
        {aiClassification && (
          <Card
            title="RELAY AI Classification Breakdown"
            subtitle="Generated via Google Gemini semantic analysis"
            className="border-indigo-300 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/40 to-white dark:from-slate-900 dark:to-indigo-950/20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/60 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{aiClassification.category || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Suggested Priority</span>
                <div className="mt-1"><PriorityBadge priority={aiClassification.priority} /></div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Target Department</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{aiClassification.suggestedDepartment || 'Operations'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Confidence</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 block">
                  {Math.round((aiClassification.confidence || 0.95) * 100)}%
                </span>
              </div>
            </div>

            <div className="pt-3.5 space-y-2 text-xs">
              <div>
                <strong className="text-slate-700 dark:text-slate-300">Recommended Action: </strong>
                <span className="text-slate-600 dark:text-slate-400">{aiClassification.suggestedAction}</span>
              </div>
              {aiClassification.explanation && (
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Reasoning: </strong>
                  <span className="text-slate-600 dark:text-slate-400">{aiClassification.explanation}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Categorization & Metadata */}
        <Card title="Classification & Routing Parameters">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                'General',
                'IT Support',
                'Finance & Procurement',
                'HR & Personnel',
                'Operations & Facilities',
                'Sales & Marketing',
                'Legal & Compliance',
              ]}
            />

            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />

            <Input
              label="Target Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              icon={Calendar}
            />
          </div>
        </Card>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => navigate('/requests')}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} size="lg" className="shadow-md">
            Dispatch Request
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewRequestPage;

