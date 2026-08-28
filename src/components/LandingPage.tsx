import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  Brain,
  FileText,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ViewTab } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigateTab: (tab: ViewTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onOpenAuth,
  onNavigateTab,
}) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  const features = [
    {
      icon: CheckCircle2,
      title: 'Smart Task Management',
      desc: 'Seamlessly switch between List, Kanban, and Calendar views. Filter by priority, tag subtasks, and conquer daily items effortlessly.',
      badge: 'Multi-View Workflow',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Brain,
      title: 'AI Prioritization Assistant',
      desc: 'Our Gemini-powered assistant instantly answers "What should I work on first?" and creates custom daily action plans tailored to your real deadlines.',
      badge: 'Powered by Gemini',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Layers,
      title: 'Project Tracking & Milestones',
      desc: 'Organize high-level deliverables into clear workspaces. Monitor visual progress rings, deadlines, and milestone checklists.',
      badge: 'Goal Oriented',
      color: 'from-indigo-500 to-cyan-600',
    },
    {
      icon: Flame,
      title: 'Daily Focus Mode',
      desc: 'Distraction-free Pomodoro and deep-work timers. Lock in on a single task, track completed minutes, and build uninterrupted flow.',
      badge: 'Deep Work Engine',
      color: 'from-amber-500 to-rose-600',
    },
    {
      icon: FileText,
      title: 'Notes & Quick Capture',
      desc: 'Capture ideas instantly without friction. Turn any unstructured brainstorm note into an actionable task with just one click.',
      badge: 'Zero Friction',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: BarChart3,
      title: 'Productivity Analytics',
      desc: 'Gain crystal-clear visibility into your weekly throughput, focus hours, completion velocities, and peak productive days.',
      badge: 'Actionable Insights',
      color: 'from-sky-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Time Capsule
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                Intelligent Workspace
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-indigo-600 transition-colors">
              Product Preview
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#metrics" className="hover:text-indigo-600 transition-colors">
              Impact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="landing-login-btn"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
            >
              Log In
            </button>
            <button
              id="landing-get-started-btn"
              onClick={onStart}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all rounded-lg shadow-sm shadow-indigo-600/25 flex items-center gap-1.5"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Ambient Subtle Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Work Command Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
          >
            Stop Managing Tasks.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start Getting Work Done.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Time Capsule brings your tasks, projects, deadlines, notes, and priorities into one intelligent workspace. Answer{' '}
            <strong className="text-slate-900 font-semibold">“What should I work on right now?”</strong> in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="hero-primary-cta"
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base group cursor-pointer"
            >
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 text-base"
            >
              <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
              <span>See How It Works</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Built-in Gemini AI
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Instant 1-click launch
            </span>
          </motion.div>
        </div>

        {/* Animated Dashboard Interactive Preview */}
        <div id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 mt-14 sm:mt-18">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-2xl bg-white p-2 sm:p-4 shadow-xl border border-slate-200/90 ring-1 ring-slate-900/5 overflow-hidden"
          >
            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-slate-400">app.timecapsule.workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Workspace
                </span>
              </div>
            </div>

            {/* Simulated Live Workspace Interactive Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-5 bg-slate-50/70 rounded-xl mt-3">
              {/* Left Column: Priorities & Today Focus */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>Good morning, Alex</span>
                      <span className="text-lg">👋</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You have 3 top priorities recommended by Time Capsule AI for today.
                    </p>
                  </div>
                  <button
                    onClick={onStart}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Command Center</span>
                  </button>
                </div>

                {/* Top 3 Focus Tasks */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      Today's Focus
                    </span>
                    <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={onStart}>
                      View all 8 tasks &rarr;
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg border border-rose-200/80 bg-rose-50/40 flex items-center justify-between gap-3 hover:bg-rose-50/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-rose-400 flex items-center justify-center text-transparent hover:text-rose-600 cursor-pointer">
                          ✓
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            Finish client proposal for Alpha Corp
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="text-rose-600 font-semibold">Urgent</span>
                            <span>• Due Today</span>
                            <span>• ~45m</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px]">
                              Alpha Corp
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-700">
                        In Progress
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-blue-200/80 bg-blue-50/30 flex items-center justify-between gap-3 hover:bg-blue-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center text-transparent hover:text-blue-600 cursor-pointer">
                          ✓
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            Reply to project stakeholder emails
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="text-blue-600 font-semibold">Medium</span>
                            <span>• Due Today</span>
                            <span>• ~20m</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px]">
                              Website Redesign
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-700">
                        Todo
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-transparent hover:text-slate-600 cursor-pointer">
                          ✓
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            Review presentation slides for Q3 Launch
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="text-slate-600 font-semibold">Medium</span>
                            <span>• Due Tomorrow</span>
                            <span>• ~30m</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px]">
                              Marketing Campaign
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-slate-600">
                        Todo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Stats & AI Chat preview */}
              <div className="lg:col-span-4 space-y-4">
                {/* Stats 2x2 grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Tasks Today</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">12</div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> 4 completed
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Focus Time</span>
                    <div className="text-2xl font-extrabold text-indigo-600 mt-1">3h 42m</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Goal: 4h</div>
                  </div>
                </div>

                {/* AI Assistant Quick preview */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-4 rounded-xl text-white shadow-md">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Time Capsule AI</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    “Start with the client proposal. It is due today, marked urgent, and estimated for 45 mins. After that, reply to pending client emails.”
                  </p>
                  <button
                    onClick={onStart}
                    className="mt-3 w-full py-1.5 bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/30 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                  >
                    <span>Ask AI Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Metric Highlights */}
      <section id="metrics" className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Built for modern work
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Empowering builders, teams & creators worldwide
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">10K+</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Tasks Organized</div>
              <div className="text-xs text-slate-400 mt-0.5">Across 40+ countries</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">2K+</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Active Daily Users</div>
              <div className="text-xs text-slate-400 mt-0.5">Creators & freelancers</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">98%</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Task Satisfaction</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified completion rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-purple-600">3.8x</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">Focus Velocity</div>
              <div className="text-xs text-slate-400 mt-0.5">Fewer dropped deadlines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (6 Feature Cards) */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Complete Productivity Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              One Command Center. Zero Fragmented Tools.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Stop juggling WhatsApp messages, sticky notes, spreadsheets, and calendar reminders. Time Capsule coordinates every phase of your daily execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const IconComponent = f.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-sm`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore module</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Frictionless Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              How Time Capsule Powers Your Day
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Natural Quick-Add Capture</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Type naturally like <span className="text-slate-800 font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">“Finish proposal tomorrow at 5 PM, high priority”</span>. AI extracts deadlines, tags, and priorities automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Instant AI Prioritization</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The smart command center computes urgency, deadlines, and project milestones to present your top 3 needle-moving tasks every morning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Distraction-Free Focus</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lock in on single tasks with customized Pomodoro timers. Track focus streaks, celebrate wins with confetti, and view weekly productivity charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto mb-4 text-indigo-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to reclaim 10+ hours every week?
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto">
            Join thousands of creators, freelancers, and builders who organize their work effortlessly in Time Capsule.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-start-free-btn"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Free Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              T
            </div>
            <span className="font-bold text-white text-sm">Time Capsule</span>
            <span className="text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onStart} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-white transition-colors">
              Sign In
            </button>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <span className="text-indigo-400 font-semibold">Gemini 3.7 Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
