import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  Coffee,
  Brain,
  CheckSquare,
  Award,
} from 'lucide-react';
import { Task, FocusSession } from '../types';
import { playCelebrationConfetti } from '../utils/helpers';

interface FocusModeViewProps {
  tasks: Task[];
  activeFocusTask: Task | null;
  onSelectFocusTask: (task: Task | null) => void;
  onLogSession: (session: FocusSession) => void;
  onCompleteTask: (taskId: string) => void;
  isFocusRunning: boolean;
  timeRemaining: number;
  totalDuration: number;
  onStartTimer: (durationSeconds: number) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onResetTimer: (durationSeconds: number) => void;
  focusSessions: FocusSession[];
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  tasks,
  activeFocusTask,
  onSelectFocusTask,
  onLogSession,
  onCompleteTask,
  isFocusRunning,
  timeRemaining,
  totalDuration,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  focusSessions,
}) => {
  const [sessionType, setSessionType] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [ambientType, setAmbientType] = useState<'rain' | 'whitenoise' | 'binaural'>('whitenoise');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio Context reference for synthesizer ambient sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  // Ambient sound synthesizer
  const toggleAmbientSound = () => {
    if (isAmbientSoundOn) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAmbientSoundOn(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Generate gentle white/pink noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02; // Soft brown/pink noise
          lastOut = data[i];
          data[i] *= 0.15; // gentle volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = ambientType === 'rain' ? 800 : 400;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(0);
        noiseNodeRef.current = noise;
        setIsAmbientSoundOn(true);
      } catch {
        // audio context blocked or not supported
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleSelectPreset = (minutes: number, type: 'focus' | 'short-break' | 'long-break') => {
    setSessionType(type);
    onResetTimer(minutes * 60);
  };

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`space-y-6 max-w-5xl mx-auto ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto flex flex-col justify-center' : ''
      }`}
    >
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>Focus Immersion</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-task flow state with Pomodoro tracking & soundscape.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Button */}
          <button
            onClick={toggleAmbientSound}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isAmbientSoundOn
                ? 'bg-purple-100 border-purple-300 text-purple-800 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isAmbientSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{isAmbientSoundOn ? 'Sound On' : 'Ambient Noise'}</span>
          </button>

          {/* Fullscreen Trigger */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Toggle Zen Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Presets */}
        <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/15 mb-8 backdrop-blur-md">
          <button
            onClick={() => handleSelectPreset(25, 'focus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sessionType === 'focus' && totalDuration === 25 * 60
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleSelectPreset(45, 'focus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sessionType === 'focus' && totalDuration === 45 * 60
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            45m Deep Work
          </button>
          <button
            onClick={() => handleSelectPreset(5, 'short-break')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sessionType === 'short-break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => handleSelectPreset(15, 'long-break')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sessionType === 'long-break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            15m Long Break
          </button>
        </div>

        {/* Circular Live Clock Display */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Circular SVG Ring */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000"
                fill="transparent"
              />
            </svg>

            {/* Inner Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md">
                {formatMinutes(timeRemaining)}
              </span>
              <span className="text-xs font-semibold text-indigo-300 mt-2 uppercase tracking-widest">
                {sessionType === 'focus' ? 'Deep Work Session' : 'Rest & Recharge'}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Task Target */}
        <div className="max-w-md mx-auto my-6 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              <span>Current Target Task</span>
            </span>
            {activeFocusTask && (
              <button
                onClick={() => onCompleteTask(activeFocusTask.id)}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
              </button>
            )}
          </div>

          <select
            value={activeFocusTask?.id || ''}
            onChange={(e) => {
              const found = tasks.find((t) => t.id === e.target.value) || null;
              onSelectFocusTask(found);
            }}
            className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-indigo-400/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Pick a task to focus on --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.priority})
              </option>
            ))}
          </select>
        </div>

        {/* Timer Play / Pause Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {!isFocusRunning ? (
            <button
              onClick={() => (timeRemaining > 0 ? onResumeTimer() : onStartTimer(totalDuration))}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{timeRemaining === totalDuration ? 'Start Focus' : 'Resume Focus'}</span>
            </button>
          ) : (
            <button
              onClick={onPauseTimer}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-sm font-black rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-slate-950" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={() => onResetTimer(totalDuration)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Focus History & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Total Focus Today</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {Math.floor(
              focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60
            )}h{' '}
            {focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) % 60}m
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across {focusSessions.length} logged sessions
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Completed Sprints</span>
          <div className="text-2xl font-black text-indigo-600 mt-2">
            {focusSessions.filter((s) => s.completed).length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Full Pomodoro cycles finished</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Average Focus Duration</span>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {focusSessions.length > 0
              ? Math.round(
                  focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / focusSessions.length
                )
              : 25}{' '}
            mins
          </div>
          <span className="text-xs text-slate-500 mt-1 block">High cognitive flow state</span>
        </div>
      </div>
    </div>
  );
};
