import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Layers,
  Zap,
} from 'lucide-react';
import { Task, Project, Priority } from '../types';
import { getPriorityBadge } from '../utils/helpers';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  projects: Project[];
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  projects,
}) => {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{
    title: string;
    priority: Priority;
    dueDate: string | null;
    estimatedMinutes: number;
    tags: string[];
    projectId: string | null;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setParsedPreview(null);
    }
  }, [isOpen]);

  // Client-side quick parser debounced for instant feedback
  useEffect(() => {
    if (!input.trim()) {
      setParsedPreview(null);
      return;
    }

    const text = input.trim();
    let priority: Priority = 'medium';
    if (/\b(urgent|asap|critical|emergency|p0)\b/i.test(text)) priority = 'urgent';
    else if (/\b(high|important|priority|p1)\b/i.test(text)) priority = 'high';
    else if (/\b(low|whenever|someday|p3)\b/i.test(text)) priority = 'low';

    let estimatedMinutes = 30;
    const durationMatch = text.match(/(\d+)\s*(?:min|mins|minute|minutes|h|hr|hrs|hour|hours)/i);
    if (durationMatch) {
      const num = parseInt(durationMatch[1], 10);
      if (/h|hr|hour/i.test(durationMatch[0])) estimatedMinutes = num * 60;
      else estimatedMinutes = num;
    }

    let dueDate = null;
    const now = new Date();
    if (/\btomorrow\b/i.test(text)) {
      const d = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      dueDate = d.toISOString().split('T')[0];
    } else if (/\btoday\b/i.test(text)) {
      dueDate = now.toISOString().split('T')[0];
    } else if (/\bnext week\b/i.test(text)) {
      const d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      dueDate = d.toISOString().split('T')[0];
    }

    // Match project
    let matchedProjectId: string | null = null;
    for (const p of projects) {
      if (text.toLowerCase().includes(p.title.toLowerCase())) {
        matchedProjectId = p.id;
        break;
      }
    }

    // Clean title
    let title = text
      .replace(/,\s*(high|medium|low|urgent)\s*priority/i, '')
      .replace(/\b(high|medium|low|urgent)\s*priority\b/i, '')
      .replace(/\b(tomorrow|today|next week)\b(?:\s+at\s+\d+(?::\d+)?\s*(?:am|pm)?)?/i, '')
      .replace(/\b\d+\s*(?:mins|min|minutes|hours|hrs|hour)\b/i, '')
      .trim();

    if (!title) title = text;

    setParsedPreview({
      title,
      priority,
      dueDate,
      estimatedMinutes,
      tags: priority === 'urgent' ? ['urgent'] : ['quick-add'],
      projectId: matchedProjectId || (projects[0]?.id ?? null),
    });
  }, [input, projects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsParsing(true);
    let finalTaskData = parsedPreview;

    try {
      // Try backend AI natural parser endpoint
      const res = await fetch('/api/ai/parse-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, projects }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.task) {
          finalTaskData = {
            title: json.task.title || parsedPreview?.title || input,
            priority: (json.task.priority as Priority) || parsedPreview?.priority || 'medium',
            dueDate: json.task.dueDate || parsedPreview?.dueDate || null,
            estimatedMinutes: json.task.estimatedMinutes || parsedPreview?.estimatedMinutes || 30,
            tags: json.task.tags || parsedPreview?.tags || [],
            projectId: parsedPreview?.projectId || null,
          };
        }
      }
    } catch {
      // Use local parsed
    } finally {
      setIsParsing(false);
    }

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: finalTaskData?.title || input,
      description: '',
      priority: finalTaskData?.priority || 'medium',
      status: 'todo',
      dueDate: finalTaskData?.dueDate || new Date().toISOString().split('T')[0],
      estimatedMinutes: finalTaskData?.estimatedMinutes || 30,
      tags: finalTaskData?.tags || ['quick-add'],
      projectId: finalTaskData?.projectId || null,
      projectName: projects.find((p) => p.id === finalTaskData?.projectId)?.title || null,
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    onClose();
  };

  const samplePrompts = [
    'Finish the website proposal tomorrow at 5 PM, high priority',
    'Record YouTube tutorial episode, urgent 45m',
    'Review marketing campaign draft next week, medium priority',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base">Quick Add Task</h3>
              <p className="text-[11px] text-slate-300">Natural-language AI smart extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Type naturally what you want to get done:
            </label>
            <textarea
              autoFocus
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Finish the website proposal tomorrow at 5 PM, high priority"
              className="w-full p-3.5 text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-relaxed"
            />
          </div>

          {/* Sample quick prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-medium transition-colors text-left"
                >
                  “{sample}”
                </button>
              ))}
            </div>
          </div>

          {/* Live Extracted Preview */}
          {parsedPreview && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Interpreted Breakdown</span>
              </div>

              <div className="text-sm font-bold text-slate-900">{parsedPreview.title}</div>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Priority */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[11px] border ${
                    getPriorityBadge(parsedPreview.priority).bg
                  } ${getPriorityBadge(parsedPreview.priority).text}`}
                >
                  {getPriorityBadge(parsedPreview.priority).label}
                </span>

                {/* Due Date */}
                {parsedPreview.dueDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {parsedPreview.dueDate}
                  </span>
                )}

                {/* Duration */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                  <Clock className="w-3 h-3 text-slate-400" />
                  ~{parsedPreview.estimatedMinutes}m
                </span>

                {/* Project */}
                {parsedPreview.projectId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                    <Layers className="w-3 h-3 text-indigo-600" />
                    {projects.find((p) => p.id === parsedPreview.projectId)?.title}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isParsing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isParsing ? (
                <span>Parsing with AI...</span>
              ) : (
                <>
                  <span>Create Task</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
