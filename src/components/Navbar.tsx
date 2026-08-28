import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sparkles,
  Flame,
  CheckCircle2,
  X,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { NotificationItem, UserProfile, ViewTab } from '../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenQuickAdd: () => void;
  onOpenSearch: () => void;
  onNavigateTab: (tab: ViewTab) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  isFocusRunning: boolean;
  focusTimeRemaining: number;
  focusTaskTitle?: string;
  user?: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenQuickAdd,
  onOpenSearch,
  onNavigateTab,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  isFocusRunning,
  focusTimeRemaining,
  focusTaskTitle,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTimeMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-sm font-medium transition-all w-48 sm:w-64 md:w-80 justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
            <span className="truncate">Search tasks, projects, notes...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Focus Mode Pill (if timer running) */}
        {isFocusRunning && (
          <button
            onClick={() => onNavigateTab('focus')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs hover:bg-amber-100 transition-colors animate-pulse"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono">{formatTimeMinutes(focusTimeRemaining)}</span>
            <span className="hidden lg:inline text-amber-700 font-normal truncate max-w-[120px]">
              • {focusTaskTitle || 'Focusing'}
            </span>
          </button>
        )}

        {/* AI Assistant Quick Button */}
        <button
          id="navbar-ai-assistant-btn"
          onClick={() => onNavigateTab('ai-assistant')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-purple-700 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Ask AI</span>
        </button>

        {/* Primary Add Task Button */}
        <button
          id="navbar-add-task-btn"
          onClick={onOpenQuickAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No new notifications 🎉
                  </div>
                ) : (
                  notifications.map((n) => {
                    let dotColor = 'bg-blue-500';
                    if (n.type === 'urgent') dotColor = 'bg-rose-500';
                    if (n.type === 'warning') dotColor = 'bg-amber-500';
                    if (n.type === 'achievement') dotColor = 'bg-emerald-500';

                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          if (n.linkTab) onNavigateTab(n.linkTab as ViewTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          n.isRead
                            ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                            : 'bg-indigo-50/40 border-indigo-100 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <span className="font-bold text-xs">{n.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
