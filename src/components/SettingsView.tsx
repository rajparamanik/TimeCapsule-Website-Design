import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Bell,
  Volume2,
  Clock,
  Sparkles,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, Task, Project, Note } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  tasks: Task[];
  projects: Project[];
  notes: Note[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  tasks,
  projects,
  notes,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(user.defaultFocusDuration || 25);
  const [autoPlaySound, setAutoPlaySound] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      defaultFocusDuration: defaultDuration,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      user,
      tasks,
      projects,
      notes,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `time-capsule-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure focus timer defaults, notification alerts, and data portability.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Focus Defaults Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Focus Timer Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Pomodoro Duration (Minutes)
              </label>
              <select
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                <option value={15}>15 Minutes</option>
                <option value={25}>25 Minutes (Standard Pomodoro)</option>
                <option value={45}>45 Minutes (Deep Work Sprint)</option>
                <option value={60}>60 Minutes (Intensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ambient Sound Auto-Start
              </label>
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlaySound}
                    onChange={(e) => setAutoPlaySound(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Automatically play ambient noise during sessions</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & System */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span>Alerts & Reminders</span>
          </h3>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Overdue Task Warnings</div>
                <div className="text-[11px] text-slate-500">
                  Notify when a task has passed its due date.
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">Daily Morning Briefing</div>
                <div className="text-[11px] text-slate-500">
                  AI daily priority summary generated at 8:00 AM.
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Data Portability / Export */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Data Portability & Backup</span>
          </h3>
          <p className="text-xs text-slate-500">
            Export all your tasks, projects, notes, and focus history as a clean JSON file.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Workspace JSON</span>
            </button>
          </div>
        </div>

        {/* Save button and banner */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
