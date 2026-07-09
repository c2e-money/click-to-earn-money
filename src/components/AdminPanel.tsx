import React, { useState, useEffect } from "react";
import { 
  Users, Link, Eye, DollarSign, ShieldAlert, Edit2, Check,
  Trash2, Search, AlertCircle, Ban, RefreshCw, Star, Settings, 
  Clock, CheckCircle2, XCircle, FileText, ArrowDownToLine, Megaphone
} from "lucide-react";
import { 
  listenToAdminStats, 
  listenToAllUsers, 
  listenToUserLinks, 
  modifyUserDocAdmin, 
  rerouteShortLinkAdmin, 
  deleteShortenedLink,
  listenToSystemConfig,
  updateSystemConfigDoc,
  listenToAllWithdrawals,
  processWithdrawalRequest
} from "../lib/firebaseService";
import { Withdrawal } from "../types";

interface AdminPanelProps {
  userUid: string;
}

export default function AdminPanel({ userUid }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"users" | "links" | "withdrawals" | "analytics" | "ads">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search/Filters
  const [userQuery, setUserQuery] = useState("");
  const [linkQuery, setLinkQuery] = useState("");
  const [withdrawalQuery, setWithdrawalQuery] = useState("");
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Edit State triggers
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [updatingUser, setUpdatingUser] = useState(false);

  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [editTargetUrl, setEditTargetUrl] = useState("");
  const [updatingLink, setUpdatingLink] = useState(false);

  // Withdrawal processing state triggers
  const [processingWithdrawal, setProcessingWithdrawal] = useState<Withdrawal | null>(null);
  const [processingStatus, setProcessingStatus] = useState<"approved" | "rejected" | null>(null);
  const [processReasonOrProof, setProcessReasonOrProof] = useState("");
  const [submittingProcess, setSubmittingProcess] = useState(false);

  // Global CPM rate states & Ad Scripts
  const [globalCpmRate, setGlobalCpmRate] = useState("5.00");
  const [popunderCode, setPopunderCode] = useState("");
  const [bannerAdCode, setBannerAdCode] = useState("");
  const [nativeAdCode, setNativeAdCode] = useState("");
  const [socialBarCode, setSocialBarCode] = useState("");
  const [savingCpm, setSavingCpm] = useState(false);
  const [savingAds, setSavingAds] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Real-time admin statistics listener
    const unsubStats = listenToAdminStats(userUid, (realtimeStats) => {
      setStats(realtimeStats);
      setLoading(false);
    });

    // Real-time global users listener
    const unsubUsers = listenToAllUsers(userUid, (realtimeUsers) => {
      setUsers(realtimeUsers);
    });

    // Real-time global links listener
    const unsubLinks = listenToUserLinks(userUid, "admin", (realtimeLinks) => {
      setLinks(realtimeLinks);
    });

    // Real-time configuration (CPM and Ads) listener
    const unsubConfig = listenToSystemConfig(userUid, (config) => {
      setGlobalCpmRate((config.globalCpm || 5.00).toFixed(2));
      setPopunderCode(config.popunderCode || "");
      setBannerAdCode(config.bannerAdCode || "");
      setNativeAdCode(config.nativeAdCode || "");
      setSocialBarCode(config.socialBarCode || "");
    });

    // Real-time all withdrawals listener
    const unsubWithdrawals = listenToAllWithdrawals(userUid, (realtimeWithdrawals) => {
      setWithdrawals(realtimeWithdrawals);
    });

    return () => {
      unsubStats();
      unsubUsers();
      unsubLinks();
      unsubConfig();
      unsubWithdrawals();
    };
  }, [userUid]);

  const handleUpdateCpm = async () => {
    const parsed = parseFloat(globalCpmRate);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid CPM rate above $0.00.");
      return;
    }
    setSavingCpm(true);
    try {
      await updateSystemConfigDoc(userUid, { globalCpm: parsed });
    } catch (err: any) {
      alert(err.message || "Failed to update global CPM rate.");
    } finally {
      setSavingCpm(false);
    }
  };

  // Handle User Edit Profile
  const triggerUserEdit = (user: any) => {
    setEditingUser(user);
    setEditBalance(user.balance.toString());
    setEditRole(user.role);
  };

  const saveUserEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdatingUser(true);
    try {
      const parsedBal = parseFloat(editBalance) || 0;
      await modifyUserDocAdmin(userUid, editingUser.uid, {
        role: editRole,
        balance: parsedBal,
        availableBalance: parsedBal
      });
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || "Save edits failed.");
    } finally {
      setUpdatingUser(false);
    }
  };

  // Handle Save Ad Placements
  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAds(true);
    try {
      await updateSystemConfigDoc(userUid, {
        popunderCode,
        bannerAdCode,
        nativeAdCode,
        socialBarCode
      });
      alert("Ad placements and network scripts successfully updated!");
    } catch (err: any) {
      alert(err.message || "Failed to update ad configurations.");
    } finally {
      setSavingAds(false);
    }
  };

  // Toggle User Ban Status
  const handleToggleBan = async (user: any) => {
    const actionStr = user.isBanned ? "UNBAN" : "BAN";
    if (!confirm(`Are you sure you want to ${actionStr} user ${user.email}?`)) return;

    try {
      await modifyUserDocAdmin(userUid, user.uid, { isBanned: !user.isBanned });
    } catch (err: any) {
      alert(err.message || "Failed to complete operation.");
    }
  };

  // Handle Link Target URL Edit
  const triggerLinkEdit = (link: any) => {
    setEditingLink(link);
    setEditTargetUrl(link.originalUrl);
  };

  const saveLinkEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    setUpdatingLink(true);
    try {
      await rerouteShortLinkAdmin(userUid, editingLink.id, editTargetUrl);
      setEditingLink(null);
    } catch (err: any) {
      alert(err.message || "Failed to save link updates.");
    } finally {
      setUpdatingLink(false);
    }
  };

  // Force delete a link administratively
  const handleAdminDeleteLink = async (id: string) => {
    if (!confirm("ADMIN NOTICE: Delete this short link across the entire platform? This action is irreversible.")) return;

    try {
      await deleteShortenedLink(id, userUid, "admin");
    } catch (err: any) {
      alert(err.message || "Administrative delete failed.");
    }
  };

  const handleProcessWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingWithdrawal || !processingStatus) return;

    if (!processReasonOrProof.trim()) {
      alert(processingStatus === "approved" ? "Please enter payment reference proof ID." : "Please specify withdrawal rejection reason.");
      return;
    }

    setSubmittingProcess(true);
    try {
      await processWithdrawalRequest(
        userUid, 
        processingWithdrawal.id, 
        processingStatus, 
        processReasonOrProof.trim()
      );
      setProcessingWithdrawal(null);
      setProcessingStatus(null);
      setProcessReasonOrProof("");
    } catch (err: any) {
      alert(err.message || "Failed to process withdrawal request.");
    } finally {
      setSubmittingProcess(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const queryLower = withdrawalQuery.toLowerCase();
    const matchesQuery = 
      w.id.toLowerCase().includes(queryLower) ||
      w.userId.toLowerCase().includes(queryLower) ||
      (w.userEmail && w.userEmail.toLowerCase().includes(queryLower));
    
    const matchesStatus = withdrawalStatusFilter === "all" || w.status === withdrawalStatusFilter;
    return matchesQuery && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading master administrator controls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center max-w-sm mx-auto my-12">
        <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-pulse" />
        <h3 className="text-white font-bold">Unauthorized Security Context</h3>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.uid.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredLinks = links.filter(l => 
    l.shortCode.toLowerCase().includes(linkQuery.toLowerCase()) ||
    l.originalUrl.toLowerCase().includes(linkQuery.toLowerCase()) ||
    l.userId.toLowerCase().includes(linkQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-md mx-auto pb-12 px-4" id="admin-panel-viewport">
      
      {/* Welcome Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 tracking-wider uppercase">System Controller</span>
          <h1 className="text-xl font-black text-white tracking-tight">Root Authority</h1>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="p-2 bg-[#131a2e] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* GLOBAL CPM CONTROLLER */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-rose-500">
          <Settings className="w-5 h-5 text-rose-400 animate-spin-slow" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">Global Earning Parameters</h2>
        </div>
        
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Global CPM Rate ($)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <span className="absolute left-3.5 top-2.5 text-xs font-extrabold text-slate-500">$</span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                value={globalCpmRate}
                onChange={(e) => setGlobalCpmRate(e.target.value)}
                placeholder="5.00"
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono font-bold"
                id="global-cpm-input"
              />
            </div>
            <button
              onClick={handleUpdateCpm}
              disabled={savingCpm}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-rose-600/10"
              id="global-cpm-apply-btn"
            >
              {savingCpm ? "Applying..." : "Apply Rate"}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Adjusting this dynamically updates pay rates for all valid clicks across the network. Current Yield: <span className="font-bold text-slate-400">${(parseFloat(globalCpmRate) || 0).toFixed(2)} CPM</span> (${((parseFloat(globalCpmRate) || 0) / 1000).toFixed(4)} per redirect).
          </p>
        </div>
      </div>

      {/* ADMIN TABS SWITCHER */}
      <div className="grid grid-cols-5 gap-1 bg-[#131a2e] p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab("users")}
          className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
            activeTab === "users" 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("links")}
          className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
            activeTab === "links" 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Links
        </button>
        <button
          onClick={() => setActiveTab("withdrawals")}
          className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
            activeTab === "withdrawals" 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Payouts
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
            activeTab === "analytics" 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("ads")}
          className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
            activeTab === "ads" 
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Ads Setup
        </button>
      </div>

      {/* ==========================================
          TAB 1: USER MANAGEMENT MODULE
          ========================================== */}
      {activeTab === "users" && (
        <div className="space-y-4">
          
          {/* Lookup Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user email or ID..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          {/* User list */}
          <div className="space-y-3" id="admin-users-list">
            {filteredUsers.length === 0 ? (
              <div className="py-10 text-center select-none text-slate-500 text-xs">
                No matching registered users.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div 
                  key={u.uid} 
                  className={`bg-[#0b0f19] border rounded-2xl p-4 space-y-3 transition-all ${
                    u.isBanned ? "border-red-950 bg-red-950/5" : "border-slate-800/80"
                  }`}
                >
                  
                  {/* Row 1: Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{u.email}</span>
                        {u.role === "admin" && (
                          <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 text-[8px] font-black uppercase rounded border border-rose-500/20">
                            Admin
                          </span>
                        )}
                        {u.isBanned && (
                          <span className="px-1.5 py-0.5 bg-red-500/15 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20">
                            Banned
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono">UID: {u.uid}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerUserEdit(u)}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-all"
                        title="Edit User Ledger"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleToggleBan(u)}
                        className={`p-1.5 border rounded-lg transition-all ${
                          u.isBanned 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                            : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                        }`}
                        title={u.isBanned ? "Pardon User" : "Ban User"}
                      >
                        <Ban className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-slate-400 border-t border-slate-800/50 pt-3 select-none">
                    <div>
                      <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Hits</span>
                      <span className="text-xs font-bold text-white font-mono">{u.totalClicks || 0}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Earnings</span>
                      <span className="text-xs font-bold text-white font-mono">${u.totalEarnings?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase font-black tracking-widest text-slate-500">Ledger</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">${u.balance?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: GLOBAL LINKS TRACKER
          ========================================== */}
      {activeTab === "links" && (
        <div className="space-y-4">
          
          {/* Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search code or destination URL..."
              value={linkQuery}
              onChange={(e) => setLinkQuery(e.target.value)}
              className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="space-y-3" id="admin-links-list">
            {filteredLinks.length === 0 ? (
              <div className="py-10 text-center select-none text-slate-500 text-xs">
                No active links found.
              </div>
            ) : (
              filteredLinks.map((l) => (
                <div key={l.id} className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 space-y-3">
                  
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-rose-400 font-mono">/r/{l.shortCode}</span>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-mono">Creator ID: {l.userId}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerLinkEdit(l)}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-all"
                        title="Edit Target URL"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleAdminDeleteLink(l.id)}
                        className="p-1.5 bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/20 transition-all"
                        title="Force Delete Path"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="p-2 bg-[#131a2e] rounded-xl border border-slate-800 text-[10px] text-slate-400 break-all select-all font-mono">
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-wider block mb-0.5">Original URL</span>
                    {l.originalUrl}
                  </div>

                  {/* Clicks and CPM Row */}
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 border-t border-slate-800/40 pt-2.5">
                    <span>CPM: ${l.cpm?.toFixed(2) || "5.00"}</span>
                    <span className="px-2 py-0.5 bg-rose-500/5 text-rose-400 border border-rose-500/15 rounded-full">
                      {l.totalClicks || 0} Platform hits
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: SYSTEM ANALYTICS STREAM
          ========================================== */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          
          {/* Live Core metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 text-center select-none">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">Global Clicks</span>
              <span className="text-xl font-black text-white font-mono">{stats?.totalClicks?.toLocaleString() || "0"}</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 text-center select-none">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">Global Payout</span>
              <span className="text-xl font-black text-emerald-400 font-mono">${stats?.totalEarnings?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 text-center select-none">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">Total Codes</span>
              <span className="text-xl font-black text-white font-mono">{stats?.totalLinks || "0"}</span>
            </div>
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 text-center select-none">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">Average CPM</span>
              <span className="text-xl font-black text-amber-400 font-mono">${stats?.avgCpm?.toFixed(2) || "5.00"}</span>
            </div>
          </div>

          {/* Demographic list */}
          {stats?.countryStats && stats.countryStats.length > 0 && (
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Top traffic geographics</h2>
              <div className="space-y-3">
                {stats.countryStats.slice(0, 5).map((c: any, index: number) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>{c.name}</span>
                      <span>{c.value} clicks</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${stats.totalClicks > 0 ? (c.value / stats.totalClicks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==========================================
          TAB 4: WITHDRAWAL MANAGEMENT LIST
          ========================================== */}
      {activeTab === "withdrawals" && (
        <div className="space-y-4">
          
          {/* Lookup Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user, email or withdrawal ID..."
              value={withdrawalQuery}
              onChange={(e) => setWithdrawalQuery(e.target.value)}
              className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-1 bg-[#131a2e] p-0.5 rounded-lg border border-slate-800/80">
            {(["all", "pending", "approved", "rejected"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setWithdrawalStatusFilter(st)}
                className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-black rounded-md transition-all ${
                  withdrawalStatusFilter === st 
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/15" 
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* List render */}
          <div className="space-y-3">
            {filteredWithdrawals.length === 0 ? (
              <div className="py-12 text-center select-none text-slate-600 text-xs">
                No matching withdrawal records.
              </div>
            ) : (
              filteredWithdrawals.map((w) => (
                <div 
                  key={w.id} 
                  className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all"
                >
                  {/* Row 1: ID, Email, Date */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black font-mono text-slate-400">{w.id.toUpperCase()}</span>
                      <p className="text-[9px] text-slate-500 leading-normal font-bold block">{w.userEmail || "Anonymous User"}</p>
                    </div>
                    
                    {/* Status badges */}
                    {w.status === "pending" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase rounded-full">
                        <Clock className="w-2.5 h-2.5 animate-spin" />
                        Pending
                      </span>
                    )}
                    {w.status === "approved" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded-full">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Approved
                      </span>
                    )}
                    {w.status === "rejected" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase rounded-full">
                        <XCircle className="w-2.5 h-2.5" />
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* Row 2: Amount & Gateway info */}
                  <div className="flex justify-between items-center text-xs font-bold bg-[#131a2e] p-2.5 rounded-xl border border-slate-850">
                    <span className="text-white font-mono">${w.amount.toFixed(2)} USD</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">{w.paymentMethod}</span>
                  </div>

                  {/* Row 3: Target account & details */}
                  <div className="text-[9px] text-slate-500 space-y-1 bg-[#131a2e]/40 p-2 rounded-lg border border-slate-850/50">
                    <div className="flex justify-between">
                      <span>Registered Mobile No:</span>
                      <span className="font-mono text-slate-300">
                        {w.paymentDetails?.mobileNumber || "N/A"}
                      </span>
                    </div>

                    {w.status === "approved" && w.referenceId && (
                      <div className="flex justify-between border-t border-slate-800/45 pt-1 text-emerald-400">
                        <span>UTR Reference ID:</span>
                        <span className="font-mono font-bold text-slate-300">{w.referenceId}</span>
                      </div>
                    )}

                    {w.status === "rejected" && w.rejectionReason && (
                      <div className="flex justify-between border-t border-slate-800/45 pt-1 text-rose-400">
                        <span>Rejection Reason:</span>
                        <span className="font-bold text-slate-300">{w.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Row for Pending Withdrawals */}
                  {w.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setProcessingWithdrawal(w);
                          setProcessingStatus("rejected");
                          setProcessReasonOrProof("");
                        }}
                        className="py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-[10px] font-bold rounded-lg transition-all"
                      >
                        Reject & Refund User
                      </button>
                      <button
                        onClick={() => {
                          setProcessingWithdrawal(w);
                          setProcessingStatus("approved");
                          setProcessReasonOrProof("");
                        }}
                        className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold rounded-lg transition-all"
                      >
                        Approve & Mark Paid
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ==========================================
          TAB 5: AD NETWORK & INTEGRATION SETTINGS
          ========================================== */}
      {activeTab === "ads" && (
        <form onSubmit={handleSaveAds} className="space-y-6">
          <div className="bg-[#0b0f19] border border-rose-500/15 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-6 -mt-6" />
            
            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800/60 pb-4">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tight">Monetization & Ad Scripts</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Integrate Adsterra, PropellerAds, or custom ad networks directly into short-link redirect loops.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Popunder / Direct Link URL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between font-sans">
                  <span>Popunder / Direct Link URL</span>
                  <span className="text-[9px] text-rose-400 lowercase font-medium">high eCPM fallback</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.profitablecpmrate.com/..."
                  value={popunderCode}
                  onChange={(e) => setPopunderCode(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all font-mono"
                />
                <p className="text-[9px] text-slate-500 mt-1 font-sans">This direct link will be loaded in the background or during redirect hops to credit your ad account CPM.</p>
              </div>

              {/* Banner Ad (300x250) Code */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between font-sans">
                  <span>Banner Ad (300x250) script or iframe</span>
                  <span className="text-[9px] text-rose-400 lowercase font-medium">sidebar widget</span>
                </label>
                <textarea
                  rows={4}
                  placeholder='<iframe src="https://ad.a-ads.com/..." ...></iframe>'
                  value={bannerAdCode}
                  onChange={(e) => setBannerAdCode(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all font-mono"
                />
                <p className="text-[9px] text-slate-500 mt-1 font-sans">Paste your Adsterra 300x250 HTML script snippet or iframe tag. Supports raw scripts and custom iframe configurations.</p>
              </div>

              {/* Native Ad (468x60) Code */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between font-sans">
                  <span>Native Banner Ad (468x60 / 728x90) script</span>
                  <span className="text-[9px] text-rose-400 lowercase font-medium">top/bottom header</span>
                </label>
                <textarea
                  rows={4}
                  placeholder='<iframe src="https://ad.a-ads.com/..." ...></iframe>'
                  value={nativeAdCode}
                  onChange={(e) => setNativeAdCode(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all font-mono"
                />
                <p className="text-[9px] text-slate-500 mt-1 font-sans">Paste your horizontal header banner code. Renders responsively across desktop and mobile devices.</p>
              </div>

              {/* Social Bar / Pop Widget Code */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between font-sans">
                  <span>Social Bar Script / In-Page Push Code</span>
                  <span className="text-[9px] text-rose-400 lowercase font-medium">pop-up alert ads</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="<!-- Adsterra Social Bar Script -->"
                  value={socialBarCode}
                  onChange={(e) => setSocialBarCode(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all font-mono"
                />
                <p className="text-[9px] text-slate-500 mt-1 font-sans">Paste in-page push scripts, floating banners, or standard chat widget monetization alerts.</p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingAds}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-500/10 flex items-center gap-2 font-sans"
              >
                {savingAds ? "Saving Placements..." : "Save Ad Placements"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ==========================================
          MODALS / INLINE EDIT SHEET OVERLAYS
          ========================================== */}
      
      {/* 1. Edit User Modal Sheet */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5 text-rose-400">
              <Settings className="w-4 h-4" />
              Adjust Ledger Details
            </h3>
            <p className="text-[11px] text-slate-400">Modifying profile stats for user: <span className="font-bold text-slate-200">{editingUser.email}</span></p>

            <form onSubmit={saveUserEdits} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Account Balance ($)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin (Full Root Control)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingUser}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  {updatingUser ? "Saving..." : "Save Edits"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Link Modal Sheet */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5 text-rose-400">
              <Settings className="w-4 h-4" />
              Reroute target endpoint
            </h3>
            <p className="text-[11px] text-slate-400">Updating target for shortcode: <span className="font-bold text-slate-200">/r/{editingLink.shortCode}</span></p>

            <form onSubmit={saveLinkEdits} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Destination URL</label>
                <textarea
                  value={editTargetUrl}
                  onChange={(e) => setEditTargetUrl(e.target.value)}
                  className="w-full h-20 bg-[#131a2e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingLink}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  {updatingLink ? "Saving..." : "Save Route"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. Process Withdrawal Modal Sheet */}
      {processingWithdrawal && processingStatus && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center gap-2 text-rose-400">
              <ArrowDownToLine className="w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                {processingStatus === "approved" ? "Approve & Mark Paid" : "Reject & Refund Amount"}
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              You are updating withdrawal request <span className="font-mono text-slate-200">{processingWithdrawal.id.toUpperCase()}</span> for <span className="font-bold text-slate-200">${processingWithdrawal.amount.toFixed(2)}</span>.
              {processingStatus === "rejected" && " This will automatically refund the full amount to the user's available balance."}
            </p>

            <form onSubmit={handleProcessWithdrawal} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {processingStatus === "approved" ? "Payment Proof / Reference UTR ID" : "Reason for Rejection"}
                </label>
                <input
                  type="text"
                  placeholder={processingStatus === "approved" ? "e.g. UTR827392837" : "e.g. Invalid UPI handle / coordinates"}
                  value={processReasonOrProof}
                  onChange={(e) => setProcessReasonOrProof(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setProcessingWithdrawal(null);
                    setProcessingStatus(null);
                    setProcessReasonOrProof("");
                  }}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProcess}
                  className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1 transition-all ${
                    processingStatus === "approved" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  {submittingProcess ? "Processing..." : processingStatus === "approved" ? "Approve Payout" : "Reject Payout"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
