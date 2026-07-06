import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Link2, Sparkles, TrendingUp, Zap, Users, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';

interface LandingPageProps {
  user: User | null;
  onNavigate: (path: string) => void;
}

export default function LandingPage({ user, onNavigate }: LandingPageProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedLink, setShortenedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalShortenedLinks: 24820,
    totalClicks: 153240,
    flatCpm: 5.00
  });

  useEffect(() => {
    // Fetch live statistics from backend
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    if (!user) {
      onNavigate('/register');
      return;
    }

    setLoading(true);
    setError('');
    setShortenedLink('');

    try {
      const response = await fetch('/api/links/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, userId: user.id })
      });
      const data = await response.json();
      if (data.success && data.link) {
        // Build the full gate url
        const hostUrl = window.location.origin;
        setShortenedLink(`${hostUrl}/gate/${data.link.shortCode}/p1`);
        setOriginalUrl('');
      } else {
        setError(data.error || 'Failed to shorten URL. Please try again.');
      }
    } catch (err) {
      setError('Connection failure. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden" id="landing-page-root">
      {/* Background ambient glowing grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-24 text-center z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Ultimate URL Customizer & Earning Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none">
          Shorten Links & Earn <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-500">
            Guaranteed Cash
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-xl mb-10 leading-relaxed">
          Unlock maximum revenue for every visitor. Share custom URLs optimized with premium ad layout layers, backed by real-time analytics and instant payouts.
        </p>

        {/* Shortener Box */}
        <div className="max-w-3xl mx-auto mb-16" id="shortener-widget-container">
          <form onSubmit={handleShorten} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Paste your long URL here (e.g. https://google.com)..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-3.5 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm border-0"
                id="shorten-input-url"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-95 transition-all duration-200 text-sm flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              id="shorten-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{user ? 'Shorten Now' : 'Sign Up & Earn'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Copy Results Display */}
          {shortenedLink && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center justify-between gap-3 animate-fadeIn" id="shortened-result-container">
              <div className="text-left overflow-hidden">
                <span className="text-xs text-slate-400 block font-mono">Your Shortened Link:</span>
                <span className="text-sm md:text-base text-emerald-400 font-bold truncate font-mono block">{shortenedLink}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1 hover:brightness-110 cursor-pointer shrink-0 transition"
                id="copy-short-link-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-left" id="shortener-error">
              {error}
            </div>
          )}
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20" id="platform-stats-grid">
          {/* Stat 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl flex flex-col justify-between items-center text-center hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="bg-cyan-950/50 p-3 rounded-xl border border-cyan-500/20 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Guaranteed Payout Rate</span>
              <span className="text-3xl font-extrabold text-white block">${stats.flatCpm.toFixed(2)} CPM</span>
              <span className="text-xs text-cyan-400 mt-2 block">Flat rate for every 1,000 clicks</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl flex flex-col justify-between items-center text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Total Shortened Links</span>
              <span className="text-3xl font-extrabold text-white block">{stats.totalShortenedLinks.toLocaleString()}+</span>
              <span className="text-xs text-emerald-400 mt-2 block">Created globally by users</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl flex flex-col justify-between items-center text-center hover:border-pink-500/30 transition-all duration-300 group">
            <div className="bg-pink-950/50 p-3 rounded-xl border border-pink-500/20 text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Total Clicks registered</span>
              <span className="text-3xl font-extrabold text-white block">{stats.totalClicks.toLocaleString()}+</span>
              <span className="text-xs text-pink-400 mt-2 block">Successfully monetized clicks</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-5xl mx-auto border-t border-slate-800 pt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-12 text-center text-white">Why Users Love Click To Earn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left" id="features-highlights">
            <div className="flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">1</div>
              <h3 className="font-bold text-lg text-slate-100">Super Low Minimum Withdrawal</h3>
              <p className="text-sm text-slate-400">Withdraw your earnings as soon as you hit just $1.00! No need to wait for high payouts.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">2</div>
              <h3 className="font-bold text-lg text-slate-100">Multiple Payout Channels</h3>
              <p className="text-sm text-slate-400">Get paid via standard instant methods like UPI, PayPal, Payeer, or secure Crypto (USDT).</p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold border border-pink-500/20">3</div>
              <h3 className="font-bold text-lg text-slate-100">Zero Delay Payments</h3>
              <p className="text-sm text-slate-400">Request daily payouts, and experience zero payout gaps. Support responds 24/7/365.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
