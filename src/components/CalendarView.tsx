import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
} from 'lucide-react';
import { Task, Project } from '../types';
import { getPriorityBadge, isOverdue } from '../utils/helpers';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onOpenQuickAdd: (defaultDate?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onOpenQuickAdd,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  // Compute month calendar days grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    dateString: string;
    isCurrentMonth: boolean;
  }> = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    calendarDays.push({
      dayNumber: d,
      dateString: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currDate = new Date(year, month, d);
    calendarDays.push({
      dayNumber: d,
      dateString: currDate.toISOString().split('T')[0],
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid (42 cells = 6 weeks)
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    calendarDays.push({
      dayNumber: d,
      dateString: nextMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  // Tasks for currently selected day
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);
  const selectedDayMilestones: Array<{ title: string; projectTitle: string; color: string }> = [];
  projects.forEach((p) => {
    (p.milestones || []).forEach((m) => {
      if (m.date === selectedDateStr) {
        selectedDayMilestones.push({
          title: m.title,
          projectTitle: p.title,
          color: p.color,
        });
      }
    });
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {monthNames[month]} {year}
            </h1>
            <p className="text-xs text-slate-500">Track deadlines, sprints, and launch dates.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onOpenQuickAdd(selectedDateStr)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-3 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Cells */}
          <div className="grid grid-cols-7 gap-1.5 mt-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateString === selectedDateStr;
              const isToday = item.dateString === new Date().toISOString().split('T')[0];

              // Count tasks and milestones for this day
              const dayTasks = tasks.filter((t) => t.dueDate === item.dateString);
              const dayMilestones = projects.flatMap((p) =>
                (p.milestones || []).filter((m) => m.date === item.dateString)
              );

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(item.dateString)}
                  className={`min-h-[85px] sm:min-h-[105px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                      : item.isCurrentMonth
                      ? 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      : 'border-slate-50 bg-slate-50/40 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isSelected
                          ? 'text-indigo-900 font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.dayNumber}
                    </span>

                    {(dayTasks.length > 0 || dayMilestones.length > 0) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </div>

                  {/* Badges preview in cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium ${
                          t.status === 'completed'
                            ? 'bg-slate-100 text-slate-400 line-through'
                            : t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-bold pl-1">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Selected Day</span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedDateStr}</h3>
              </div>
              <button
                onClick={() => onOpenQuickAdd(selectedDateStr)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                title="Add task for this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Milestones list */}
            {selectedDayMilestones.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Project Milestones
                </span>
                {selectedDayMilestones.map((m, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 text-xs font-semibold text-purple-900"
                  >
                    <div>{m.title}</div>
                    <div className="text-[10px] text-purple-600 font-normal">
                      Project: {m.projectTitle}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Day Tasks list */}
            <div className="mt-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Scheduled Tasks ({selectedDayTasks.length})
              </span>

              {selectedDayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No tasks due on this date.
                </div>
              ) : (
                selectedDayTasks.map((t) => {
                  const p = getPriorityBadge(t.priority);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onToggleTask(t.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                            t.status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {t.status === 'completed' && '✓'}
                        </button>
                        <span
                          className={`text-xs font-bold text-slate-800 ${
                            t.status === 'completed' ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${p.bg} ${p.text}`}
                      >
                        {p.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => onOpenQuickAdd(selectedDateStr)}
            className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
          >
            + Add Task for {selectedDateStr}
          </button>
        </div>
      </div>
    </div>
  );
};
