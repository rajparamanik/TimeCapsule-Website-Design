import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  X,
  Trash2,
} from 'lucide-react';
import { Project, Task, Priority } from '../types';
import { getPriorityBadge } from '../utils/helpers';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Design & Dev');
  const [newPriority, setNewPriority] = useState<Priority>('high');
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [newColor, setNewColor] = useState('#6366F1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Key initiative and deliverable workspace.',
      category: newCategory,
      priority: newPriority,
      deadline: newDeadline,
      color: newColor,
      progress: 0,
      tasksCount: 0,
      completedCount: 0,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Kickoff and discovery phase', date: newDeadline, completed: false },
        { id: `m_${Date.now()}_2`, title: 'Execution and draft delivery', date: newDeadline, completed: false },
        { id: `m_${Date.now()}_3`, title: 'Final milestone signoff', date: newDeadline, completed: false },
      ],
      notes: '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProj);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const colors = ['#6366F1', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize high-level roadmaps, track milestone timelines, and monitor progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedCount = projectTasks.filter((t) => t.status === 'completed').length;
          const totalTasks = projectTasks.length || project.tasksCount || 0;
          const computedProgress =
            totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : project.progress;
          const priority = getPriorityBadge(project.priority);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                style={{ backgroundColor: project.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${priority.bg} ${priority.text} ${priority.border}`}
                    >
                      {priority.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Progress</span>
                    <span className="font-extrabold text-indigo-600">{computedProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${computedProgress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {completedCount} / {totalTasks} tasks
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.deadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Create New Project</h3>
                <p className="text-xs text-slate-400">Establish a dedicated workspace with milestones.</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Website Redesign, Marketing Campaign"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Objective and core deliverables..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Design, Growth, Client"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Theme Color</label>
                  <div className="flex items-center gap-2 pt-1">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">“{projectToDelete.title}”</strong>? 
                This will permanently delete this project. Any associated tasks will remain in your workspace and will simply be unassigned from this project.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
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
