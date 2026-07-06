import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle, Coins, BarChart3, ShieldCheck, Zap } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
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
        onLoginSuccess(data.user);
        onNavigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[calc(100vh-73px)] flex items-center justify-center p-4 relative overflow-hidden" id="login-page-root">
      {/* Background neon grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d1527_1px,transparent_1px),linear-gradient(to_bottom,#0d1527_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10" id="login-container-grid">
        
        {/* Left Side: Premium Cyberpunk Info-Section */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-cyan-500/15 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.05)]" id="login-info-section">
          <div>
            <span className="text-cyan-400 font-extrabold uppercase tracking-widest text-xs block mb-2">JOIN THE EARNING REVOLUTION</span>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-emerald-400">
              Click To Earn Platform
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Transform your digital traffic into cold hard cash with our secure verification loop.
            </p>
          </div>

          {/* Bold Metrics Display Section */}
          <div className="space-y-4" id="platform-trust-badges">
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-500/25 transition">
              <div className="text-cyan-400 bg-cyan-950/50 p-2.5 rounded-lg border border-cyan-500/20 mt-0.5">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block text-sm">💰 Flat $5.00 CPM Rate</span>
                <span className="text-xs text-slate-400">Earn high revenue on every single click/visit</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-500/25 transition">
              <div className="text-emerald-400 bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-500/20 mt-0.5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block text-sm">📊 Platform Statistics</span>
                <span className="text-xs text-slate-400">24,500+ Total Shortened Links & 150,000+ Total Clicks</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-500/25 transition">
              <div className="text-amber-400 bg-amber-950/50 p-2.5 rounded-lg border border-amber-500/20 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block text-sm">🛡️ 100% Trusted & Secure</span>
                <span className="text-xs text-slate-400">Daily Payouts via UPI, PayPal, Payeer, and Crypto (USDT)</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-500/25 transition">
              <div className="text-pink-400 bg-pink-950/50 p-2.5 rounded-lg border border-pink-500/20 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-100 block text-sm">🚀 Fast & Reliable</span>
                <span className="text-xs text-slate-400">Low $1.00 Minimum Withdrawal limit with 24/7 dedicated User Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)]" id="login-form-box">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-white">Access Your Dashboard</h3>
            <p className="text-xs text-slate-400 mt-1">Sign in to view link clicks, generate payments and withdraw cash.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2 animate-shake" id="login-error-alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
            {/* Email */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. dipenshorts@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  id="login-email-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  id="login-password-input"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black py-3 rounded-lg shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.5)] transition hover:brightness-110 flex items-center justify-center space-x-1 cursor-pointer"
              id="login-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
            <span className="text-xs text-slate-400">Don't have an account yet? </span>
            <button 
              onClick={() => onNavigate('/register')}
              className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer flex items-center justify-center mx-auto mt-1"
              id="login-nav-to-register"
            >
              <span>Register a free account</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
