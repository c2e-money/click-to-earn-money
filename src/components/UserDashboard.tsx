import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Link2, Copy, Trash2, Calendar, Eye, 
  DollarSign, BarChart3, Globe, Compass, Check, AlertCircle, Plus 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from "recharts";
import { 
  listenToUserStats, 
  listenToUserLinks, 
  createShortenedLink, 
  deleteShortenedLink,
  listenToGlobalCpm
} from "../lib/firebaseService";

interface UserDashboardProps {
  userUid: string;
}

export default function UserDashboard({ userUid }: UserDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [globalCpm, setGlobalCpm] = useState<number>(5.00);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Shortening Form States
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Link utilities states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Subscribe to real-time stats
    const unsubscribeStats = listenToUserStats(userUid, (realtimeStats) => {
      setStats(realtimeStats);
      setLoading(false);
    });

    // Subscribe to real-time user links
    const unsubscribeLinks = listenToUserLinks(userUid, "user", (realtimeLinks) => {
      setLinks(realtimeLinks.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    // Subscribe to real-time global CPM
    const unsubscribeCpm = listenToGlobalCpm(userUid, (realtimeCpm) => {
      setGlobalCpm(realtimeCpm);
    });

    return () => {
      unsubscribeStats();
      unsubscribeLinks();
      unsubscribeCpm();
    };
  }, [userUid]);

  // Handle URL shortening creation
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!originalUrl) {
      setFormError("Destination URL is required.");
      return;
    }

    setFormLoading(true);
    try {
      const link = await createShortenedLink(originalUrl, customCode || null, userUid);
      setFormSuccess(link);
      setOriginalUrl("");
      setCustomCode("");
    } catch (err: any) {
      setFormError(err.message || "Failed to create short link.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle deletion of short link
  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this shortened link?")) return;

    try {
      await deleteShortenedLink(id, userUid, "user");
    } catch (err: any) {
      alert(err.message || "Unable to delete link.");
    }
  };

  // Handle Link Copy Action
  const copyToClipboard = (code: string, id: string) => {
    const fullUrl = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading user analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-bounce" />
        <h3 className="text-white font-bold">Failed to load statistics</h3>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl transition-all">
          Retry Sync
        </button>
      </div>
    );
  }

  // Neon color array for chart bars
  const neonColors = ["#10b981", "#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#3b82f6"];

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12 px-4" id="user-dashboard-viewport">
      
      {/* 1. Header welcome */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Active Session</span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Earning Desk</h1>
        </div>
        <div className="px-3 py-1.5 bg-[#131a2e] border border-slate-800 rounded-2xl text-[10px] text-slate-400 font-bold select-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          CPM Engine active
        </div>
      </div>

      {/* 2. STATS GRID - 4 compact cards optimized for Mobile */}
      <div className="grid grid-cols-2 gap-3" id="stats-grid-container">
        
        {/* Earnings Card */}
        <div className="bg-[#0b0f19] border border-emerald-500/15 rounded-2xl p-3.5 glow-green relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl -mr-4 -mt-4" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">Total Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-lg font-black text-white font-mono">${stats?.totalEarnings?.toFixed(4) || "0.0000"}</span>
            <p className="text-[9px] text-emerald-500/70 font-semibold mt-0.5">Balance: ${stats?.balance?.toFixed(4) || "0.00"}</p>
          </div>
        </div>

        {/* Hits Card */}
        <div className="bg-[#0b0f19] border border-purple-500/15 rounded-2xl p-3.5 glow-purple relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl -mr-4 -mt-4" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest">Total Hits</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-lg font-black text-white font-mono">{stats?.totalClicks?.toLocaleString() || "0"}</span>
            <p className="text-[9px] text-purple-500/70 font-semibold mt-0.5">Verified impressions</p>
          </div>
        </div>

        {/* Active Links Card */}
        <div className="bg-[#0b0f19] border border-indigo-500/15 rounded-2xl p-3.5 relative overflow-hidden select-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">Active Links</span>
            <Link2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-lg font-black text-white font-mono">{stats?.activeLinksCount || "0"}</span>
            <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Global short codes</p>
          </div>
        </div>

        {/* Average CPM Card */}
        <div className="bg-[#0b0f19] border border-amber-500/15 rounded-2xl p-3.5 glow-amber relative overflow-hidden select-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Average CPM</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-lg font-black text-white font-mono">${globalCpm.toFixed(2)}</span>
            <p className="text-[9px] text-amber-500/70 font-semibold mt-0.5">Earnings per 1K hits</p>
          </div>
        </div>

      </div>

      {/* 3. DYNAMIC URL SHORTENER TOOL */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <Plus className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-tight">Create Monetized Link</h2>
        </div>

        <form onSubmit={handleShorten} className="space-y-4">
          
          {/* Target URL */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Destination URL</label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com/mega-file-download"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-all"
                id="target-url-input"
              />
            </div>
          </div>

          {/* Optional custom alias */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Custom Alias (Optional)</span>
              <span className="text-[8px] text-indigo-400 lowercase">e.g. mega-bypass</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-600 select-none">/r/</span>
              <input
                type="text"
                placeholder="custom-path"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-all font-mono font-bold"
                id="custom-alias-input"
              />
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-xl text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/25 rounded-2xl space-y-2 select-none">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Check className="w-4 h-4" />
                <span>Link Generated Successfully!</span>
              </div>
              
              <div className="bg-[#0b0f19] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">
                  {window.location.origin}/r/{formSuccess.shortCode}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(formSuccess.shortCode, "success")}
                  className="p-1.5 hover:bg-slate-800 text-indigo-400 rounded-lg transition-all"
                >
                  {copiedId === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[9px] text-slate-400">Share this link to start converting visits into real-time account earnings.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
            id="shorten-submit-btn"
          >
            {formLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                GENERATE SHORT LINK
                <Link2 className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>

      {/* 4. PERFORMANCE CHARTS */}
      {stats?.clicksOverTime && stats?.clicksOverTime.length > 0 && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">Traffic Stream (7 Days)</h2>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.clicksOverTime} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={9} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131a2e", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "10px" }}
                  labelStyle={{ fontWeight: "bold", color: "#f1f5f9" }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Impressions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. LINKS DIRECTORY */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <Link2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-tight font-display">Generated links</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500">{links.length} total</span>
        </div>

        {links.length === 0 ? (
          <div className="py-10 text-center select-none">
            <Link2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No shortened links active.</p>
            <p className="text-[10px] text-slate-600 mt-1">Submit your first URL above to activate tracking.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1" id="links-scroll-container">
            {links.map((link) => {
              const fullShortUrl = `${window.location.origin}/r/${link.shortCode}`;
              return (
                <div key={link.id} className="bg-[#131a2e] border border-slate-800 rounded-xl p-3 space-y-2.5 relative hover:border-slate-700 transition-all">
                  
                  {/* Title & Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono text-indigo-400">/r/{link.shortCode}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(link.shortCode, link.id)}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-all"
                        title="Copy Short Link"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/20 transition-all"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Original URL Display */}
                  <div className="text-[10px] text-slate-400 break-all bg-[#0b0f19] p-2 rounded-lg border border-slate-800/60 max-h-12 overflow-hidden overflow-y-auto">
                    <span className="text-slate-600 uppercase font-black tracking-wider text-[8px] mr-1.5 block">Target Endpoint</span>
                    {link.originalUrl}
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500 border-t border-slate-800/80 pt-2.5 select-none">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(link.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 bg-indigo-500/5 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded-full font-mono">
                      <Eye className="w-3 h-3 text-indigo-500" />
                      {link.totalClicks || 0} hits
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. ANCILLARY ANALYTICS (Country & Referrer Breakdown) */}
      {stats && (stats.countryStats?.length > 0 || stats.referrerStats?.length > 0) && (
        <div className="grid grid-cols-2 gap-3" id="secondary-breakdown-panel">
          
          {/* Countries */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Countries
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats.countryStats.slice(0, 5).map((c: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{c.name}</span>
                    <span>{c.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${stats.totalClicks > 0 ? (c.value / stats.totalClicks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrers */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              Channels
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats.referrerStats.slice(0, 5).map((r: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{r.name}</span>
                    <span>{r.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-400 rounded-full"
                      style={{ width: `${stats.totalClicks > 0 ? (r.value / stats.totalClicks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
