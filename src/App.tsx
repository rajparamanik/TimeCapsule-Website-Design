import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Task,
  Project,
  Note,
  FocusSession,
  NotificationItem,
  UserProfile,
  ViewTab,
} from './types';
import {
  INITIAL_USER,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_NOTES,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { playCelebrationConfetti } from './utils/helpers';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TaskManagement } from './components/TaskManagement';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { FocusModeView } from './components/FocusModeView';
import { CalendarView } from './components/CalendarView';
import { NotesView } from './components/NotesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAssistant } from './components/AIAssistant';
import { SettingsView } from './components/SettingsView';
import { QuickAddModal } from './components/QuickAddModal';
import { SearchModal } from './components/SearchModal';

export default function App() {
  // Navigation state
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App Data States with localStorage persistence
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tc_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tc_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('tc_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('tc_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('tc_focus_sessions');
    return saved ? JSON.parse(saved) : INITIAL_FOCUS_SESSIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('tc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modal Dialogs
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Focus Mode Active Timer State
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(25 * 60);
  const [focusTotalDuration, setFocusTotalDuration] = useState(25 * 60);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Persist storage whenever data changes
  useEffect(() => {
    localStorage.setItem('tc_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tc_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tc_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tc_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('tc_focus_sessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem('tc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Global Keyboard Shortcuts (Cmd+K for search, N for quick add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Focus Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isFocusRunning && focusTimeRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isFocusRunning && focusTimeRemaining === 0) {
      // Session Complete!
      setIsFocusRunning(false);
      playCelebrationConfetti();

      const newSession: FocusSession = {
        id: `fs_${Date.now()}`,
        taskId: activeFocusTask?.id || null,
        taskTitle: activeFocusTask?.title || 'Focused Sprint',
        durationMinutes: Math.round(focusTotalDuration / 60),
        completed: true,
        completedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };
      setFocusSessions((prev) => [newSession, ...prev]);

      // Add Notification
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: 'Focus Sprint Completed! 🏆',
        message: `Great job! You completed ${Math.round(
          focusTotalDuration / 60
        )} minutes of deep focus.`,
        type: 'achievement',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'focus',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusRunning, focusTimeRemaining, focusTotalDuration, activeFocusTask]);

  // Focus Timer Actions
  const handleStartTimer = (durationSeconds: number) => {
    setFocusTotalDuration(durationSeconds);
    setFocusTimeRemaining(durationSeconds);
    setIsFocusRunning(true);
  };

  const handlePauseTimer = () => {
    setIsFocusRunning(false);
  };

  const handleResumeTimer = () => {
    setIsFocusRunning(true);
  };

  const handleResetTimer = (durationSeconds: number) => {
    setIsFocusRunning(false);
    setFocusTotalDuration(durationSeconds);
    setFocusTimeRemaining(durationSeconds);
  };

  const handleStartFocusWithTask = (task: Task) => {
    setActiveFocusTask(task);
    const duration = (task.estimatedMinutes || 25) * 60;
    setFocusTotalDuration(duration);
    setFocusTimeRemaining(duration);
    setIsFocusRunning(true);
    setCurrentTab('focus');
  };

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'completed';
          if (isNowCompleted) {
            playCelebrationConfetti();
          }
          return {
            ...t,
            status: isNowCompleted ? 'completed' : 'todo',
            completedAt: isNowCompleted ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSaveTask = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [task, ...prev];
    });
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Task Created',
      message: `"${newTask.title}" added to your workspace.`,
      type: 'info',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'tasks',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Project Actions
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('project-detail');
  };

  const handleCreateProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDeleteProject = (projectId: string) => {
    const targetProject = projects.find((p) => p.id === projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Unassign tasks from this project so tasks are safely retained in workspace
    setTasks((prev) =>
      prev.map((t) =>
        t.projectId === projectId
          ? { ...t, projectId: null, projectName: null }
          : t
      )
    );
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setCurrentTab('projects');
    }
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Project Deleted',
      message: `"${targetProject?.title || 'Project'}" and its milestone roadmap were deleted.`,
      type: 'warning',
      timestamp: 'Just now',
      isRead: false,
      linkTab: 'projects',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Note Actions
  const handleSaveNote = (note: Note) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleConvertNoteToTask = (note: Note) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: note.title !== 'Untitled Scratchpad' ? note.title : 'Action item from note',
      description: note.content,
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 30,
      tags: ['from-notes', ...note.tags],
      projectId: projects[0]?.id || null,
      projectName: projects[0]?.title || null,
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    handleAddTask(newTask);
    setCurrentTab('tasks');
  };

  // User Actions
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Count calculations
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const focusMinutesToday = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab !== 'project-detail') setSelectedProjectId(null);
          setCurrentTab(tab);
        }}
        pendingTasksCount={pendingTasksCount}
        user={user}
        isFocusRunning={isFocusRunning}
        focusTimeRemaining={focusTimeRemaining}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateTab={(tab) => {
            if (tab !== 'project-detail') setSelectedProjectId(null);
            setCurrentTab(tab);
          }}
          notifications={notifications}
          onMarkNotificationRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            )
          }
          onClearNotifications={() => setNotifications([])}
          isFocusRunning={isFocusRunning}
          focusTimeRemaining={focusTimeRemaining}
          focusTaskTitle={activeFocusTask?.title}
          user={user}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              user={user}
              tasks={tasks}
              projects={projects}
              focusMinutesToday={focusMinutesToday}
              onToggleTask={handleToggleTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onStartFocus={handleStartFocusWithTask}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectProject={handleSelectProject}
            />
          )}

          {currentTab === 'tasks' && (
            <TaskManagement
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onSaveTask={handleSaveTask}
              onStartFocus={handleStartFocusWithTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onSelectProject={handleSelectProject}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentTab === 'project-detail' && selectedProject && (
            <ProjectDetailPage
              project={selectedProject}
              tasks={tasks}
              onBack={() => setCurrentTab('projects')}
              onToggleTask={handleToggleTask}
              onSaveTask={handleSaveTask}
              onDeleteTask={handleDeleteTask}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onStartFocus={handleStartFocusWithTask}
            />
          )}

          {currentTab === 'focus' && (
            <FocusModeView
              tasks={tasks}
              activeFocusTask={activeFocusTask}
              onSelectFocusTask={setActiveFocusTask}
              onLogSession={(s) => setFocusSessions((prev) => [s, ...prev])}
              onCompleteTask={handleToggleTask}
              isFocusRunning={isFocusRunning}
              timeRemaining={focusTimeRemaining}
              totalDuration={focusTotalDuration}
              onStartTimer={handleStartTimer}
              onPauseTimer={handlePauseTimer}
              onResumeTimer={handleResumeTimer}
              onResetTimer={handleResetTimer}
              focusSessions={focusSessions}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {currentTab === 'notes' && (
            <NotesView
              notes={notes}
              projects={projects}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onConvertNoteToTask={handleConvertNoteToTask}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              projects={projects}
              focusSessions={focusSessions}
              user={user}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AIAssistant
              tasks={tasks}
              projects={projects}
              onStartFocus={handleStartFocusWithTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={handleUpdateUser}
              tasks={tasks}
              projects={projects}
              notes={notes}
            />
          )}
        </main>
      </div>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        projects={projects}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tasks={tasks}
        projects={projects}
        notes={notes}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onSelectProject={handleSelectProject}
      />
    </div>
  );
}
