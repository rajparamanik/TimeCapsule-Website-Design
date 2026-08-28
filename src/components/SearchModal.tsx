import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckSquare,
  FolderKanban,
  FileText,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Task, Project, Note, ViewTab } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  onNavigateTab: (tab: ViewTab) => void;
  onSelectProject: (projectId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  notes,
  onNavigateTab,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : tasks.slice(0, 3);

  const matchedProjects = q
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : projects.slice(0, 2);

  const matchedNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : notes.slice(0, 2);

  const hasResults =
    matchedTasks.length > 0 || matchedProjects.length > 0 || matchedNotes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, projects, notes, tags..."
            className="w-full text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!hasResults ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No results found for “{query}”.
            </div>
          ) : (
            <>
              {/* Tasks group */}
              {matchedTasks.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tasks ({matchedTasks.length})</span>
                  </div>
                  {matchedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onNavigateTab('tasks');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            t.status === 'completed'
                              ? 'bg-emerald-500'
                              : t.priority === 'urgent'
                              ? 'bg-rose-500'
                              : 'bg-indigo-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          {t.title}
                        </span>
                        {t.projectName && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            • {t.projectName}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Projects group */}
              {matchedProjects.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Projects ({matchedProjects.length})</span>
                  </div>
                  {matchedProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400">({p.progress}% done)</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes group */}
              {matchedNotes.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Notes ({matchedNotes.length})</span>
                  </div>
                  {matchedNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigateTab('notes');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {n.content || 'Scratchpad'}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with click or shortcuts</span>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
