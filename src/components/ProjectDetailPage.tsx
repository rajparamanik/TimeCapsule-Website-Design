import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Flame,
  FileText,
  Layers,
  Flag,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { Project, Task, Milestone } from '../types';
import { getPriorityBadge, isOverdue } from '../utils/helpers';

interface ProjectDetailPageProps {
  project: Project;
  tasks: Task[];
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onStartFocus: (task: Task) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  tasks,
  onBack,
  onToggleTask,
  onSaveTask,
  onDeleteTask,
  onUpdateProject,
  onDeleteProject,
  onStartFocus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'notes'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [projectNotes, setProjectNotes] = useState(project.notes || '');

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'completed');
  const remainingTasks = projectTasks.filter((t) => t.status !== 'completed');
  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : project.progress;

  const priority = getPriorityBadge(project.priority);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: 'medium',
      status: 'todo',
      dueDate: project.deadline,
      estimatedMinutes: 30,
      tags: [project.category.toLowerCase()],
      projectId: project.id,
      projectName: project.title,
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveTask(newTask);
    setNewTaskTitle('');
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const updatedMilestones: Milestone[] = [
      ...(project.milestones || []),
      {
        id: `m_${Date.now()}`,
        title: newMilestoneTitle.trim(),
        date: newMilestoneDate,
        completed: false,
      },
    ];

    onUpdateProject({ ...project, milestones: updatedMilestones });
    setNewMilestoneTitle('');
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updated = (project.milestones || []).map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    onUpdateProject({ ...project, milestones: updated });
  };

  const handleSaveNotes = () => {
    onUpdateProject({ ...project, notes: projectNotes });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: project.color }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                  {project.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${priority.bg} ${priority.text} ${priority.border}`}
                >
                  {priority.label}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{project.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium self-start sm:self-auto">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: {project.deadline}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-3xl leading-relaxed">
          {project.description}
        </p>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: `Tasks (${projectTasks.length})` },
            { id: 'timeline', label: `Timeline (${project.milestones?.length || 0})` },
            { id: 'notes', label: 'Project Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-400">Total Progress</span>
            <div className="text-3xl font-black text-indigo-600 mt-2">{progress}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: project.color }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-400">Completed Tasks</span>
            <div className="text-3xl font-black text-emerald-600 mt-2">
              {completedTasks.length}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">out of {projectTasks.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-400">Remaining Tasks</span>
            <div className="text-3xl font-black text-amber-600 mt-2">
              {remainingTasks.length}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">pending execution</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-400">Milestones</span>
            <div className="text-3xl font-black text-purple-600 mt-2">
              {(project.milestones || []).filter((m) => m.completed).length} /{' '}
              {project.milestones?.length || 0}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">milestones reached</span>
          </div>
        </div>
      )}

      {/* 2. TASKS */}
      {(activeTab === 'tasks' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Tasks</h3>
              <p className="text-xs text-slate-500">All deliverables linked to {project.title}</p>
            </div>
          </div>

          {/* Quick add inline */}
          <form onSubmit={handleCreateTask} className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={`Add a new task for ${project.title}...`}
              className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              + Add Task
            </button>
          </form>

          {/* Tasks List */}
          <div className="divide-y divide-slate-100 border-t border-slate-100 mt-3">
            {projectTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tasks created for this project yet. Add one above!
              </div>
            ) : (
              projectTasks.map((task) => {
                const p = getPriorityBadge(task.priority);
                return (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.status === 'completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 text-transparent hover:text-indigo-600'
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className={`text-xs font-bold text-slate-800 ${
                          task.status === 'completed' ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${p.bg} ${p.text}`}
                      >
                        {p.label}
                      </span>

                      {task.status !== 'completed' && (
                        <button
                          onClick={() => onStartFocus(task)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-xs"
                          title="Focus task"
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. TIMELINE & MILESTONES */}
      {(activeTab === 'timeline' || activeTab === 'overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Milestone Timeline</h3>
              <p className="text-xs text-slate-500">Key phase deliverables and target signoffs</p>
            </div>
          </div>

          <form onSubmit={handleAddMilestone} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="e.g. Prototype complete, QA Testing finished"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <input
              type="date"
              required
              value={newMilestoneDate}
              onChange={(e) => setNewMilestoneDate(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shrink-0"
            >
              + Add Milestone
            </button>
          </form>

          {/* Milestones list */}
          <div className="space-y-3 pt-2">
            {(project.milestones || []).map((m, idx) => (
              <div
                key={m.id}
                onClick={() => handleToggleMilestone(m.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  m.completed
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      m.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-400 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        m.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {m.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Target: {m.date}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {m.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Project Scratchpad & Documentation</h3>
            <p className="text-xs text-slate-500">
              Save meeting summaries, specifications, and architecture decisions.
            </p>
          </div>

          <textarea
            rows={10}
            value={projectNotes}
            onChange={(e) => setProjectNotes(e.target.value)}
            placeholder="Document project context, client feedback, links, API specs..."
            className="w-full p-4 text-xs font-mono border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed bg-slate-50/50"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Save Project Notes
            </button>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">“{project.title}”</strong>? 
                This will permanently delete this project. Any associated tasks will remain in your workspace and will simply be unassigned from this project.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteProject(project.id);
                  onBack();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
