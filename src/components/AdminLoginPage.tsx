import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, ShieldAlert, AlertCircle, ChevronLeft, LayoutDashboard } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
  accessDeniedMsg?: string;
}

export default function AdminLoginPage({ onLoginSuccess, onNavigate, accessDeniedMsg }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(accessDeniedMsg || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.success && data.user) {
        const loggedInUser: User = data.user;
        if (loggedInUser.role === 'admin' || loggedInUser.isAdmin) {
          onLoginSuccess(loggedInUser);
          onNavigate('/admin/master-control-panel');
        } else {
          setError('Access Denied: The specified credentials do not possess administrative clearance.');
        }
      } else {
        setError(data.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('Network connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-73px)] flex items-center justify-center p-4 relative overflow-hidden" id="admin-login-page-root">
      {/* Visual cyber grids & pink/crimson decorative light bubbles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c1e_1px,transparent_1px),linear-gradient(to_bottom,#130c1e_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-md w-full z-10" id="admin-login-container">
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center space-x-1 text-slate-400 hover:text-white transition text-xs font-semibold mb-6 group cursor-pointer"
          id="admin-login-back-btn"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing Page</span>
        </button>

        {/* Card Box */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden" id="admin-login-card">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 mb-4 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-1">
              AUTHORIZED ACCESS ONLY
            </span>
            <h2 className="text-2xl font-black text-white">Admin Control Gateway</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Authenticate using registered administrative credentials to access master systems parameters.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-start space-x-2.5 animate-shake" id="admin-login-error">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form">
            {/* Email Address */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@clicktoearn.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-pink-500 text-sm"
                  id="admin-email-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-pink-500 text-sm"
                  id="admin-password-input"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3 rounded-lg shadow-[0_4px_25px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_35px_rgba(244,63,94,0.5)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
              id="admin-login-submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <LayoutDashboard className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick info / guide section */}
          <div className="mt-8 pt-5 border-t border-slate-800/60 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">
              SECURE TLS CONNECTION ACTIVE
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
