export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string | null; // YYYY-MM-DD or ISO string
  estimatedMinutes?: number;
  tags: string[];
  projectId?: string | null;
  projectName?: string | null;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string | null;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  deadline: string;
  priority: Priority;
  color: string;
  category: string;
  tasksCount: number;
  completedCount: number;
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string | null;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
  completed?: boolean;
  date?: string;
  type?: 'pomodoro' | 'deep-work' | 'quick-sprint';
}

export interface NotificationItem {
  id: string;
  type: 'urgent' | 'warning' | 'achievement' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  title: string;
  dailyGoalTasks: number;
  dailyGoalFocusMinutes?: number;
  dailyGoalMinutes?: number;
  defaultFocusDuration?: number;
  streakDays?: number;
  theme: 'light' | 'dark' | 'system';
}

export type ViewTab =
  | 'landing'
  | 'dashboard'
  | 'tasks'
  | 'projects'
  | 'project-detail'
  | 'calendar'
  | 'focus'
  | 'notes'
  | 'analytics'
  | 'ai-assistant'
  | 'settings';

export type TaskViewMode = 'list' | 'kanban' | 'calendar';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'open-task' | 'start-focus' | 'open-project' | 'create-task';
    payload?: any;
    label: string;
  };
}
