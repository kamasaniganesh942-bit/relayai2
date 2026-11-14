import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PriorityBadge from '../../components/ui/PriorityBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function AIAnalysisPage() {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([
    {
      text: 'My laptop suddenly stopped working and I have an important client presentation tomorrow at 2 PM.',
      category: 'IT Support',
      priority: 'critical',
      department: 'Information Technology'
    }
  ]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze', { text: inputText });
      const analysis = res.data?.data?.data || res.data?.data || res.data;
      setResult(analysis);

      if (analysis) {
        setHistory((prev) => [
          {
            text: inputText,
            category: analysis.category || 'General',
            priority: analysis.priority || 'medium',
            department: analysis.suggestedDepartment || 'Operations'
          },
          ...prev.slice(0, 4)
        ]);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleQueries = [
    {
      label: 'IT Hardware Crisis',
      text: 'Our main database replication server started overheating and 3 slave nodes are failing health checks. Multiple enterprise clients are reporting 504 timeouts.'
    },
    {
      label: 'Finance PO Approval',
      text: 'Need executive sign-off for AWS annual reservation purchase order of $45,000 before the end of the fiscal quarter tomorrow.'
    },
    {
      label: 'HR Visa Urgency',
      text: 'Our newly transferred Lead Data Scientist in London needs their visa sponsorship renewal letter dispatched to immigration authorities within 48 hours.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            AI Request Understanding Engine
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Semantic natural language analysis powered by Google Gemini to extract intent, priority, urgency, and routing parameters.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Test Scenarios:</span>
        {sampleQueries.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(sample.text)}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <Card title="Input Business Request Text" subtitle="Paste any raw message, ticket, or email communication">
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type request details here..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Model: <strong className="text-slate-700 dark:text-slate-300">Gemini 1.5 Flash (Structured Inference)</strong>
          </span>
          <Button onClick={handleAnalyze} loading={analyzing} icon={Sparkles}>
            Comprehend & Route
          </Button>
        </div>
      </Card>

      {/* Analysis Output */}
      {result && (
        <Card
          title="Inference & Semantic Classification"
          subtitle="Real-time structured evaluation"
          className="border-indigo-300 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/30 to-white dark:from-slate-900 dark:to-indigo-950/20"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/60 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Category</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{result.category || 'General'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Predicted Priority</span>
              <div className="mt-1"><PriorityBadge priority={result.priority} /></div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Suggested Department</span>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">{result.suggestedDepartment || 'Operations'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Confidence Score</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {Math.round((result.confidence || 0.95) * 100)}%
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">Recommended Action Protocol:</strong>
              <p className="text-slate-600 dark:text-slate-300">{result.suggestedAction}</p>
            </div>

            {result.explanation && (
              <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-800 dark:text-slate-200 block mb-1">Semantic Reasoning:</strong>
                <p className="text-slate-600 dark:text-slate-300">{result.explanation}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recent Analyses History */}
      <Card title="Recent Semantic Inferences" subtitle="Audit log of analyzed communications">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {history.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{item.text}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Routed to: <strong>{item.department}</strong> &bull; Category: {item.category}
                </p>
              </div>
              <PriorityBadge priority={item.priority} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AIAnalysisPage;

