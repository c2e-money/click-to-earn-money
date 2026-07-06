import React, { useState, useEffect } from 'react';
import { User, ShortLink } from '../types';
import { Link2, Copy, Check, ExternalLink, Calendar, Search, TrendingUp, DollarSign, MousePointerClick, FileText, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (path: string) => void;
  onUserUpdate: (updatedUser: User) => void;
}

export default function Dashboard({ user, onNavigate, onUserUpdate }: DashboardProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shortenError, setShortenError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    try {
      // Fetch latest profile to sync balance/clicks
      const profileRes = await fetch(`/api/user/profile/${user.id}`);
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        onUserUpdate(profileData.user);
      }

      // Fetch links
      const linksRes = await fetch(`/api/links/my-links/${user.id}`);
      const linksData = await linksRes.json();
      if (linksData.success && linksData.links) {
        setLinks(linksData.links);
      }
    } catch (err) {
      console.error('Failed to sync dashboard statistics:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setShortenError('');

    try {
      const response = await fetch('/api/links/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, userId: user.id })
      });
      const data = await response.json();
      if (data.success && data.link) {
        setLinks([data.link, ...links]);
        setOriginalUrl('');
        // Re-fetch to sync link count
        fetchDashboardData();
      } else {
        setShortenError(data.error || 'Failed to shorten link.');
      }
    } catch (err) {
      setShortenError('Network error. Check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (linkId: string, shortCode: string) => {
    const fullUrl = `${window.location.origin}/gate/${shortCode}/p1`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(l => 
    l.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8" id="dashboard-root">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6" id="dashboard-header">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">USER CONTROLS</span>
            <h2 className="text-3xl font-black text-white">Welcome, {user.username}!</h2>
            <p className="text-xs text-slate-400 mt-1">Shorten links, view analytics, and track your payout balance in real-time.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('/withdrawal')}
              className="bg-emerald-500 hover:brightness-110 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)] text-sm flex items-center space-x-1 cursor-pointer transition"
              id="dashboard-header-withdraw-btn"
            >
              <span>Request Payout</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Earnings & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-stats-grid">
          {/* Card 1: Balance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-4 hover:border-emerald-500/20 transition">
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Available Balance</span>
              <span className="text-2xl font-black text-white block" id="dashboard-balance-display">${user.balance.toFixed(4)}</span>
              <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">Min withdrawal limit $1.00</span>
            </div>
          </div>

          {/* Card 2: Total Clicks */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-4 hover:border-cyan-500/20 transition">
            <div className="bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 p-3 rounded-xl">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total Click Visits</span>
              <span className="text-2xl font-black text-white block" id="dashboard-clicks-display">{user.totalClicks.toLocaleString()}</span>
              <span className="text-[10px] text-cyan-400 block font-medium mt-0.5">All links aggregated</span>
            </div>
          </div>

          {/* Card 3: Dynamic CPM */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-4 hover:border-pink-500/20 transition">
            <div className="bg-pink-950/40 border border-pink-500/20 text-pink-400 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Your CPM Rate</span>
              <span className="text-2xl font-black text-white block" id="dashboard-cpm-display">${user.cpm.toFixed(2)}</span>
              <span className="text-[10px] text-pink-400 block font-medium mt-0.5">Earning per 1k views</span>
            </div>
          </div>

          {/* Card 4: Links Shortened */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-4 hover:border-amber-500/20 transition">
            <div className="bg-amber-950/40 border border-amber-500/20 text-amber-400 p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Shortened Links</span>
              <span className="text-2xl font-black text-white block" id="dashboard-links-count-display">{links.length} URLs</span>
              <span className="text-[10px] text-amber-400 block font-medium mt-0.5">Active monetization layers</span>
            </div>
          </div>
        </div>

        {/* Link Shortening Widget */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800" id="dashboard-shorten-container">
          <h3 className="font-extrabold text-base text-white mb-4 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Create Short Earning Link</span>
          </h3>
          <form onSubmit={handleShorten} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Link2 className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Paste your long link here (e.g. https://github.com)..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                id="dashboard-shorten-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black px-6 py-3 rounded-xl hover:brightness-110 shadow-[0_4px_15px_rgba(6,182,212,0.3)] shrink-0 transition cursor-pointer"
              id="dashboard-shorten-submit-btn"
            >
              {loading ? 'Shortening...' : 'Generate link'}
            </button>
          </form>
          {shortenError && (
            <p className="text-xs text-rose-400 mt-2" id="dashboard-shorten-error">{shortenError}</p>
          )}
        </div>

        {/* Filter and Table of Links */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800" id="dashboard-links-table-container">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-white">Your Shortened Links</h3>
              <p className="text-xs text-slate-400 mt-0.5">Below are all active links you have shortened and shared.</p>
            </div>

            {/* Link Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                id="dashboard-links-search-input"
              />
            </div>
          </div>

          {filteredLinks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl" id="dashboard-links-empty">
              <Link2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No links found. Create your first link above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto" id="dashboard-links-table">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Original URL</th>
                    <th className="pb-3 pr-4">Shortened Link</th>
                    <th className="pb-3 pr-4 text-center">Views / Clicks</th>
                    <th className="pb-3 pr-4 text-center">Earnings</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300 text-xs">
                  {filteredLinks.map((link) => {
                    const fullShortLink = `${window.location.origin}/gate/${link.shortCode}/p1`;
                    const linkEarning = link.clicksCount * (user.cpm / 1000);
                    return (
                      <tr key={link.id} className="hover:bg-slate-950/40 transition">
                        <td className="py-3.5 pr-4 max-w-[200px] truncate">
                          <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1 font-mono">
                            <span>{link.originalUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
                          </a>
                        </td>
                        <td className="py-3.5 pr-4 max-w-[200px] truncate text-cyan-400 font-bold font-mono">
                          <a href={fullShortLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {fullShortLink}
                          </a>
                        </td>
                        <td className="py-3.5 pr-4 text-center font-bold text-slate-100">
                          {link.clicksCount}
                        </td>
                        <td className="py-3.5 pr-4 text-center text-emerald-400 font-extrabold font-mono">
                          ${linkEarning.toFixed(4)}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => copyToClipboard(link.id, link.shortCode)}
                            className="bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 px-3 py-1.5 rounded-md font-bold text-[10px] flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            {copiedId === link.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
