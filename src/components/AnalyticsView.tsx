import React from 'react';
import {
  TrendingUp,
  Award,
  FolderKanban,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Task, Project, FocusSession, UserProfile } from '../types';
import { formatDurationMinutes } from '../utils/helpers';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  focusSessions: FocusSession[];
  user?: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  projects,
  focusSessions,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const activeProjectsCount = projects.filter((p) => p.progress < 100).length;

  // Weekly data points for visualization
  const weeklyData = [
    { day: 'Mon', tasksCompleted: 5, focusMinutes: 75 },
    { day: 'Tue', tasksCompleted: 8, focusMinutes: 120 },
    { day: 'Wed', tasksCompleted: 11, focusMinutes: 165 },
    { day: 'Thu', tasksCompleted: 6, focusMinutes: 90 },
    { day: 'Fri', tasksCompleted: 9, focusMinutes: 135 },
    { day: 'Sat', tasksCompleted: 4, focusMinutes: 60 },
    { day: 'Sun', tasksCompleted: 2, focusMinutes: 30 },
  ];

  const maxWeeklyTasks = Math.max(...weeklyData.map((d) => d.tasksCompleted), 1);
  const maxWeeklyFocus = Math.max(...weeklyData.map((d) => d.focusMinutes), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Productivity Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Velocity metrics, completion trends, and time investment breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>+24% vs Last Week</span>
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{completionRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">High</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {completedTasks.length} done / {totalTasks} total
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Focus Time</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">
              {formatDurationMinutes(totalFocusMinutes)}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Across all focus sessions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500">{activeProjectsCount}</span>
            <span className="text-xs text-slate-500 font-semibold">of {projects.length} Total</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Ongoing project roadmaps</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Productivity Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-600">92 / 100</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Top 5% among creators</span>
        </div>
      </div>

      {/* Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Task Output Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Task Velocity</h3>
              <p className="text-xs text-slate-500">Tasks completed each day</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
              45 Tasks Completed
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="flex items-end justify-between gap-2 h-48 pt-6 px-2">
            {weeklyData.map((d) => {
              const heightPercent = (d.tasksCompleted / maxWeeklyTasks) * 100;
              const isPeak = d.tasksCompleted === maxWeeklyTasks;

              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.tasksCompleted}
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        isPeak ? 'bg-indigo-600 shadow-sm' : 'bg-indigo-400 hover:bg-indigo-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Progress Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Velocity</h3>
              <p className="text-xs text-slate-500">Progress across active initiatives</p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {projects.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const done = projectTasks.filter((t) => t.status === 'completed').length;
              const total = projectTasks.length || project.tasksCount || 1;
              const progress = Math.round((done / total) * 100);

              return (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate max-w-[180px]">{project.title}</span>
                    <span className="text-slate-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {done} of {total} completed
                    </span>
                    <span>Target: {project.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
