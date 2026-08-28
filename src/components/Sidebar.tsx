import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Flame,
  FileText,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ViewTab, UserProfile } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  pendingTasksCount: number;
  user?: UserProfile;
  isFocusRunning: boolean;
  focusTimeRemaining: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingTasksCount,
  user,
  isFocusRunning,
  focusTimeRemaining,
  isOpenMobile,
  onCloseMobile,
}) => {
  const formatTimeMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const navItems = [
    { id: 'dashboard' as ViewTab, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'tasks' as ViewTab,
      label: 'My Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    { id: 'projects' as ViewTab, label: 'Projects', icon: FolderKanban },
    { id: 'calendar' as ViewTab, label: 'Calendar', icon: Calendar },
    {
      id: 'focus' as ViewTab,
      label: 'Focus Mode',
      icon: Flame,
      indicator: isFocusRunning ? formatTimeMinutes(focusTimeRemaining) : undefined,
      isHot: isFocusRunning,
    },
    { id: 'notes' as ViewTab, label: 'Notes', icon: FileText },
    { id: 'analytics' as ViewTab, label: 'Analytics', icon: BarChart3 },
    {
      id: 'ai-assistant' as ViewTab,
      label: 'AI Assistant',
      icon: Bot,
      highlight: true,
    },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header - High Density Design */}
        <div>
          <div className="p-6 flex items-center gap-3">
            <div
              onClick={() => handleNavClick('dashboard')}
              className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer shadow-sm hover:bg-indigo-700 transition-colors"
            >
              TC
            </div>
            <div
              onClick={() => handleNavClick('dashboard')}
              className="cursor-pointer"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                Time Capsule
              </span>
            </div>
          </div>

          {/* Navigation list */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentTab === item.id ||
                (item.id === 'projects' && currentTab === 'project-detail');

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? 'text-indigo-600'
                          : item.highlight
                          ? 'text-purple-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {/* Badges and Indicators */}
                  <div className="flex items-center gap-1.5">
                    {item.highlight && !isActive && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                        AI
                      </span>
                    )}
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.indicator && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                        <Flame className="w-3 h-3 text-amber-600" />
                        {item.indicator}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Settings */}
        <div className="p-4 border-t border-slate-100">
          <button
            id="sidebar-nav-settings"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'settings'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
