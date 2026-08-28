import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  List,
  Columns3,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Play,
  Flame,
  CheckSquare,
  Square,
  Tag,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { Task, Project, Priority, TaskStatus, TaskViewMode } from '../types';
import {
  getPriorityBadge,
  getStatusBadge,
  isOverdue,
  isDueToday,
  isDueTomorrow,
} from '../utils/helpers';

interface TaskManagementProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSaveTask: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onOpenQuickAdd: () => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  projects,
  onToggleTask,
  onDeleteTask,
  onSaveTask,
  onStartFocus,
  onOpenQuickAdd,
}) => {
  const [viewMode, setViewMode] = useState<TaskViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  // Task edit / create modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Subtask local edit state inside modal
  const [subtaskInput, setSubtaskInput] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterProject !== 'all' && task.projectId !== filterProject) return false;

    return true;
  });

  const handleOpenEdit = (task: Task) => {
    setEditingTask({ ...task, subtasks: [...task.subtasks] });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTask({
      id: `task_${Date.now()}`,
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 30,
      tags: [],
      projectId: projects[0]?.id || null,
      projectName: projects[0]?.title || null,
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    // Resolve project name if changed
    const selProject = projects.find((p) => p.id === editingTask.projectId);
    const updatedTask: Task = {
      ...editingTask,
      projectName: selProject ? selProject.title : null,
    };

    onSaveTask(updatedTask);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim() || !editingTask) return;
    setEditingTask({
      ...editingTask,
      subtasks: [
        ...editingTask.subtasks,
        { id: `st_${Date.now()}`, title: subtaskInput.trim(), completed: false },
      ],
    });
    setSubtaskInput('');
  };

  const handleToggleSubtaskInModal = (subtaskId: string) => {
    if (!editingTask) return;
    setEditingTask({
      ...editingTask,
      subtasks: editingTask.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    });
  };

  const handleDeleteSubtaskInModal = (subtaskId: string) => {
    if (!editingTask) return;
    setEditingTask({
      ...editingTask,
      subtasks: editingTask.subtasks.filter((st) => st.id !== subtaskId),
    });
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onSaveTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Task Command</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your backlog, prioritize sprints, and track milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title, tag, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Project Filter */}
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Smart Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Your workspace is clear 🎉</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create your first task and start making structured progress.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Create Task
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredTasks.map((task) => {
            const priority = getPriorityBadge(task.priority);
            const status = getStatusBadge(task.status);
            const isTaskOverdue = isOverdue(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.status === 'completed' ? 'opacity-65 bg-slate-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Task checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-600 text-transparent hover:text-indigo-600'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-sm text-slate-900 ${
                          task.status === 'completed' ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 leading-snug">
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks counter preview */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium pt-0.5">
                        <CheckSquare className="w-3 h-3" />
                        <span>
                          {task.subtasks.filter((st) => st.completed).length} / {task.subtasks.length} subtasks completed
                        </span>
                      </div>
                    )}

                    {/* Badges metadata */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                      {/* Priority */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] border ${priority.bg} ${priority.text} ${priority.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                        {priority.label}
                      </span>

                      {/* Status */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] border ${status.bg}`}
                      >
                        {status.label}
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span
                          className={`inline-flex items-center gap-1 font-medium text-[11px] ${
                            isTaskOverdue
                              ? 'text-rose-600 font-bold'
                              : isDueToday(task.dueDate)
                              ? 'text-amber-700 font-semibold'
                              : 'text-slate-600'
                          }`}
                        >
                          <CalendarIcon className="w-3 h-3 opacity-70" />
                          {isTaskOverdue
                            ? `Overdue (${task.dueDate})`
                            : isDueToday(task.dueDate)
                            ? 'Due Today'
                            : isDueTomorrow(task.dueDate)
                            ? 'Due Tomorrow'
                            : task.dueDate}
                        </span>
                      )}

                      {/* Estimated Duration */}
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                        <Clock className="w-3 h-3 opacity-70" />
                        ~{task.estimatedMinutes || 30}m
                      </span>

                      {/* Project Tag */}
                      {task.projectName && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                          {task.projectName}
                        </span>
                      )}

                      {/* Custom Tags */}
                      {task.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => onStartFocus(task)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-amber-200"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Focus</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in-progress', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            let colTitle = 'To Do';
            let colColor = 'border-slate-300';
            if (colStatus === 'in-progress') {
              colTitle = 'In Progress';
              colColor = 'border-indigo-400';
            } else if (colStatus === 'completed') {
              colTitle = 'Completed';
              colColor = 'border-emerald-400';
            }

            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{colTitle}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-white text-slate-600 border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={handleOpenCreate}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      No tasks in {colTitle.toLowerCase()}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const priority = getPriorityBadge(task.priority);

                      return (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900 leading-snug">
                              {task.title}
                            </span>
                            <button
                              onClick={() => handleOpenEdit(task)}
                              className="p-1 text-slate-400 hover:text-slate-600"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${priority.bg} ${priority.text} ${priority.border}`}
                            >
                              {priority.label}
                            </span>

                            {task.dueDate && (
                              <span className="text-slate-500 font-medium text-[10px]">
                                {task.dueDate}
                              </span>
                            )}
                          </div>

                          {/* Quick move column buttons */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            {colStatus !== 'todo' && (
                              <button
                                onClick={() => handleStatusChange(task, 'todo')}
                                className="text-slate-400 hover:text-indigo-600 font-medium"
                              >
                                &larr; To Do
                              </button>
                            )}
                            {colStatus !== 'in-progress' && (
                              <button
                                onClick={() => handleStatusChange(task, 'in-progress')}
                                className="text-indigo-600 hover:underline font-semibold"
                              >
                                In Progress
                              </button>
                            )}
                            {colStatus !== 'completed' && (
                              <button
                                onClick={() => handleStatusChange(task, 'completed')}
                                className="text-emerald-600 hover:underline font-semibold"
                              >
                                Done &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Create / Edit Modal */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8"
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {tasks.some((t) => t.id === editingTask.id) ? 'Edit Task' : 'Create New Task'}
                </h3>
                <p className="text-xs text-slate-400">Configure deadlines, subtasks, and priorities.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="e.g., Finalize design review slides"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Add context, acceptance criteria, or links..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, priority: e.target.value as Priority })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={editingTask.estimatedMinutes || 30}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        estimatedMinutes: parseInt(e.target.value, 10) || 30,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Project</label>
                <select
                  value={editingTask.projectId || ''}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      projectId: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-indigo-600 font-medium"
                >
                  <option value="">No Project (General)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtasks Checklist Builder */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtasks Checklist</label>
                <div className="space-y-2 mb-2">
                  {editingTask.subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleToggleSubtaskInModal(st.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span
                          className={`text-xs font-medium ${
                            st.completed ? 'line-through text-slate-400' : 'text-slate-700'
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtaskInModal(st.id)}
                        className="text-slate-400 hover:text-rose-600 text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    placeholder="Add a step (e.g. Export assets)"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    + Add Step
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Delete Task?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">“{taskToDelete.title}”</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
