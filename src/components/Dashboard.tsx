import React from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  Calendar as CalendarIcon,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  CheckSquare,
} from 'lucide-react';
import { Task, Project, UserProfile, ViewTab } from '../types';
import {
  formatDurationMinutes,
  getPriorityBadge,
  getStatusBadge,
  isOverdue,
  isDueToday,
  isDueTomorrow,
} from '../utils/helpers';

interface DashboardProps {
  user: UserProfile;
  tasks: Task[];
  projects: Project[];
  focusMinutesToday: number;
  onToggleTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
  onStartFocus: (task: Task) => void;
  onNavigateTab: (tab: ViewTab) => void;
  onSelectProject: (projectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  tasks,
  projects,
  focusMinutesToday,
  onToggleTask,
  onOpenQuickAdd,
  onStartFocus,
  onNavigateTab,
  onSelectProject,
}) => {
  // Determine greeting based on current time
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  // Statistics calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedCount = completedTasks.length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status));
  const overdueCount = overdueTasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  // Intelligent prioritization of top 3 tasks:
  // 1. Urgent/Overdue
  // 2. High priority due today/tomorrow
  // 3. In-progress items
  const sortedFocusTasks = [...pendingTasks].sort((a, b) => {
    const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    const pA = priorityWeight[a.priority] || 0;
    const pB = priorityWeight[b.priority] || 0;
    if (pA !== pB) return pB - pA;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const top3Focus = sortedFocusTasks.slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {greeting}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pendingTasks.length > 0
              ? `You have ${pendingTasks.length} priority tasks and ${projects.length} active initiatives.`
              : 'All scheduled priorities are cleared for today.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-quick-add-btn"
            onClick={onOpenQuickAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          <button
            id="dashboard-ask-ai-btn"
            onClick={() => onNavigateTab('ai-assistant')}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 4 High Density Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tasks Today
          </span>
          <div className="text-2xl font-bold mt-1 text-slate-900">{totalTasks}</div>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{completedCount}</span>
            <span className="text-xs text-green-600 font-medium">
              {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% done
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overdue
          </span>
          <div className="text-2xl font-bold mt-1 text-red-500">{overdueCount}</div>
        </div>

        {/* Focus Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Focus Time
          </span>
          <div className="text-2xl font-bold mt-1 text-slate-900">
            {formatDurationMinutes(focusMinutesToday || 222)}
          </div>
        </div>
      </div>

      {/* Main 12-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today's Focus & Active Projects */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Focus Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Today's Focus</h2>
                <span className="text-xs text-slate-400">({top3Focus.length} prioritized)</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <span className="px-2.5 py-1 font-semibold bg-white text-indigo-600 rounded-md shadow-2xs">
                    List
                  </span>
                  <button
                    onClick={() => onNavigateTab('tasks')}
                    className="px-2.5 py-1 font-medium text-slate-500 hover:text-slate-900"
                  >
                    Kanban
                  </button>
                </div>
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Rows */}
            <div className="p-4 space-y-2">
              {top3Focus.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <h3 className="font-bold text-slate-800 text-sm">All focus targets completed!</h3>
                  <p className="text-xs text-slate-500 mt-1">Enjoy your flow or add a new task.</p>
                  <button
                    onClick={onOpenQuickAdd}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                  >
                    + Add New Task
                  </button>
                </div>
              ) : (
                top3Focus.map((task, index) => {
                  const priority = getPriorityBadge(task.priority);
                  const isTaskOverdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      className="group p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4 transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Checkbox */}
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-indigo-600 flex items-center justify-center text-transparent hover:text-indigo-600 transition-all cursor-pointer shrink-0"
                          title="Mark complete"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 mt-0.5">
                            {/* Priority badge */}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                task.priority === 'urgent'
                                  ? 'bg-red-100 text-red-600'
                                  : task.priority === 'high'
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {task.priority}
                            </span>

                            {/* Project tag */}
                            {task.projectName && (
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {task.projectName}
                              </span>
                            )}

                            {/* Due date */}
                            {task.dueDate && (
                              <span
                                className={`text-[11px] font-medium flex items-center gap-1 ${
                                  isTaskOverdue
                                    ? 'text-red-600 font-semibold'
                                    : isDueToday(task.dueDate)
                                    ? 'text-amber-700 font-semibold'
                                    : 'text-slate-500'
                                }`}
                              >
                                <CalendarIcon className="w-3 h-3" />
                                {isTaskOverdue ? 'Overdue' : isDueToday(task.dueDate) ? 'Today' : task.dueDate}
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{task.estimatedMinutes || 30}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <button
                        onClick={() => onStartFocus(task)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                        title="Start Focus Session"
                      >
                        <Play className="w-3 h-3 fill-indigo-700" />
                        <span>Focus</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Projects Mini Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Active Projects</h2>
                <span className="text-xs text-slate-400">({projects.length} total)</span>
              </div>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-xs font-extrabold text-indigo-600">
                      {project.progress}%
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors truncate">
                    {project.title}
                  </h3>

                  <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{project.tasksCount} tasks</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Focus Mode & AI Priority Assistant */}
        <div className="lg:col-span-4 space-y-6">
          {/* Focus Mode Block - High Density Hero */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Focus Mode
              </span>
              <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-semibold">
                Pomodoro
              </span>
            </div>

            <div className="text-center py-4">
              <div className="text-5xl font-mono font-bold tracking-tight">25:00</div>
              <p className="text-xs mt-2 opacity-80 truncate">
                {top3Focus[0] ? `Current: ${top3Focus[0].title}` : 'Ready for next sprint'}
              </p>
            </div>

            <button
              onClick={() => {
                if (top3Focus[0]) {
                  onStartFocus(top3Focus[0]);
                } else {
                  onNavigateTab('focus');
                }
              }}
              className="w-full bg-white text-indigo-600 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-indigo-600" />
              <span>Start Session</span>
            </button>
          </div>

          {/* AI Priority Assistant Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm">AI Priority Assistant</h3>
              </div>
              <button
                onClick={() => onNavigateTab('ai-assistant')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                Open Chat
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg text-xs leading-relaxed border border-slate-100 text-slate-600">
                "What should I focus on first today?"
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg text-xs leading-relaxed border border-indigo-100 text-indigo-950 font-medium">
                {top3Focus.length > 0 ? (
                  <>
                    🎯 <strong>Recommendation:</strong> Tackle{' '}
                    <strong className="text-indigo-700">{top3Focus[0].title}</strong>. It's marked{' '}
                    <span className="uppercase text-rose-600 font-bold">{top3Focus[0].priority}</span>{' '}
                    priority (~{top3Focus[0].estimatedMinutes || 30}m). Knocking it out early clears cognitive load.
                  </>
                ) : (
                  '🎉 All tasks are complete! Consider organizing your upcoming milestones.'
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => onNavigateTab('ai-assistant')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI “Plan My Day”</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
