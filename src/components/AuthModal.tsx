import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Sparkles, Check, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup' | 'forgot';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('alex.vance@workplace.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Vance');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setForgotSent(true);
        return;
      }
      onSuccess({
        ...INITIAL_USER,
        name: name.trim() || 'Alex Vance',
        email: email.trim() || 'alex.vance@workplace.io',
      });
      onClose();
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(INITIAL_USER);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase opacity-90">Time Capsule</span>
          </div>
          <h2 className="text-2xl font-black mt-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'login' && 'Sign in to access your priorities, projects, and focus timers.'}
            {mode === 'signup' && 'Get started with intelligent productivity in 30 seconds.'}
            {mode === 'forgot' && 'Enter your email address to receive a secure recovery link.'}
          </p>
        </div>

        {/* Content body */}
        <div className="p-6">
          {/* Quick Demo Access Bar */}
          <div className="mb-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-indigo-900 block">Instant Demo Access</span>
              <span className="text-indigo-600 text-[11px]">Auto-filled with Alex's workspace</span>
            </div>
            <button
              onClick={() => {
                onSuccess(INITIAL_USER);
                onClose();
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Sign In Instantly
            </button>
          </div>

          {/* Google SSO Button */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 rounded-xl font-semibold text-xs text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  or email
                </span>
              </div>
            </>
          )}

          {forgotSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                We sent a password reset link to <strong>{email}</strong>.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setMode('login');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Free Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign up free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
