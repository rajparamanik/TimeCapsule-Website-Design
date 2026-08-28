import confetti from 'canvas-confetti';
import { Priority, TaskStatus } from '../types';

export function triggerCelebrationConfetti() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#6366F1', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
  });
}

export const playCelebrationConfetti = triggerCelebrationConfetti;

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDurationMinutes(mins: number): string {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getPriorityBadge(priority: Priority): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'high':
      return {
        label: 'High Priority',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'low':
    default:
      return {
        label: 'Low Priority',
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusBadge(status: TaskStatus): {
  label: string;
  bg: string;
  text: string;
} {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-700',
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        text: 'text-indigo-700',
      };
    case 'todo':
    default:
      return {
        label: 'To Do',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        text: 'text-slate-700',
      };
  }
}

export function isOverdue(dueDate?: string | null, status?: TaskStatus): boolean {
  if (!dueDate || status === 'completed') return false;
  const due = new Date(dueDate);
  // Normalize to start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function isDueToday(dueDate?: string | null): boolean {
  if (!dueDate) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  return dueDate.startsWith(todayStr);
}

export function isDueTomorrow(dueDate?: string | null): boolean {
  if (!dueDate) return false;
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  return dueDate.startsWith(tomorrowStr);
}
