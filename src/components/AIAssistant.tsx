import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Zap,
  Play,
} from 'lucide-react';
import { Task, Project, ChatMessage } from '../types';

interface AIAssistantProps {
  tasks: Task[];
  projects: Project[];
  onStartFocus: (task: Task) => void;
  onOpenQuickAdd: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  tasks,
  projects,
  onStartFocus,
  onOpenQuickAdd,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `👋 **Hello! I am Time Capsule**, your personal AI Priority & Workflow Assistant.\n\nI have analyzed your **${
        tasks.filter((t) => t.status !== 'completed').length
      } active tasks** and **${
        projects.length
      } projects**. Ask me any question below, or pick a quick suggestion to optimize your focus flow!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: 'What should I work on first?', query: 'What should I work on first?' },
    { label: 'What tasks are overdue?', query: 'What tasks are overdue?' },
    { label: 'What can I finish in 30 minutes?', query: 'What can I finish in 30 minutes?' },
    { label: 'What should I postpone?', query: 'What should I postpone?' },
    { label: 'Plan my day.', query: 'Plan my day.' },
    { label: 'Which project needs attention?', query: 'Which project needs attention?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          tasks,
          projects,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: data.reply || "I've reviewed your priorities and updated your plan.",
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      // Intelligent fallback
      const pendingTasks = tasks.filter((t) => t.status !== 'completed');
      const topTask = pendingTasks[0];
      const fallbackReply = topTask
        ? `🎯 **Recommendation:** Start with **${topTask.title}** (${topTask.priority} priority, ~${topTask.estimatedMinutes || 30} mins). Dedicate a distraction-free 25-minute Pomodoro session to knock this out!`
        : `🎉 All your tasks are completed! You have zero pending items in your backlog.`;

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple Markdown-like formatter for bullet points, bold, italics
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Formats bold **text** and *italics*
      let processed = line;

      // Handle bold
      const parts = processed.split(/(\*\*.*?\*\*)/g);

      return (
        <p key={idx} className="min-h-[1.2em] my-1 leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={pIdx} className="italic text-slate-700">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <span>Time Capsule AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase font-semibold">
                Priority Engine
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Live context: {tasks.filter((t) => t.status !== 'completed').length} pending tasks •{' '}
              {projects.length} projects
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: `reset_${Date.now()}`,
                role: 'assistant',
                text: 'Cleared previous chat history. What would you like to plan now?',
                timestamp: 'Just now',
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          title="Reset chat conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm shadow-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {isUser ? (
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                ) : (
                  <div>{renderFormattedText(msg.text)}</div>
                )}
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs">
                  U
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-600 font-medium">Analyzing tasks & computing priority...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(p.query)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 text-slate-700 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200/80 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer Bar */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Time Capsule to prioritize, organize, or plan your schedule..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
