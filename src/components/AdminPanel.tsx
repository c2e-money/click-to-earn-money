import React, { useState, useEffect } from 'react';
import { User, Withdrawal, ShortLink } from '../types';
import {
  ShieldAlert, TrendingUp, Coins, DollarSign, Settings, Users,
  CheckCircle, LogOut, Search, Filter, Trash2, Edit3, Key,
  Ban, UserX, PlusCircle, MinusCircle, History, Save, X, Check,
  Link as LinkIcon, MousePointerClick, ArrowUpDown, ChevronRight,
  AlertTriangle, RefreshCw, Layers, CreditCard, UserCheck, Calendar, Clock, Lock
} from 'lucide-react';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

interface OverviewStats {
  totalRegisteredUsers: number;
  totalActiveUsers: number;
  totalShortenedLinks: number;
  totalClicks: number;
  totalRevenue: number;
  totalPendingWithdrawals: number;
  totalPendingWithdrawalsAmount: number;
  totalPaidWithdrawals: number;
  totalPaidWithdrawalsAmount: number;
  totalWithdrawAmount: number;
  totalPlatformBalance: number;
  today: {
    usersRegistered: number;
    linksCreated: number;
    clicksLogged: number;
  };
  chartData: Array<{
    date: string;
    users: number;
    links: number;
    clicks: number;
  }>;
}

export default function AdminPanel({ user, onLogout }: AdminPanelProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'withdrawals' | 'settings'>('overview');

  // Core Database States
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [globalCpm, setGlobalCpm] = useState(5.00);

  // Interface Loading / Sync States
  const [loading, setLoading] = useState(true);
  const [cpmLoading, setCpmLoading] = useState(false);
  const [statusLoadingMap, setStatusLoadingMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Banned'>('all');
  const [withdrawFilter, setWithdrawFilter] = useState<'all' | 'Pending' | 'Approved' | 'Paid'>('all');
  const [userSortKey, setUserSortKey] = useState<'username' | 'balance' | 'clicks' | 'createdAt'>('createdAt');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');

  // Input editing temporary maps
  const [userCpmInputs, setUserCpmInputs] = useState<Record<string, string>>({});
  const [userCpmLoading, setUserCpmLoading] = useState<Record<string, boolean>>({});

  // Dialog States & Modal Selection
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'profile' | 'editUser' | 'editBalance' | 'resetPassword' | 'userHistory' | 'deleteConfirm' | null>(null);
  const [userHistoryData, setUserHistoryData] = useState<{ links: ShortLink[]; withdrawals: Withdrawal[] }>({ links: [], withdrawals: [] });
  const [historyLoading, setHistoryLoading] = useState(false);

  // Form Fields for Active Modal State
  const [editUserForm, setEditUserForm] = useState({
    username: '',
    email: '',
    balance: '',
    cpm: '',
    status: 'Active' as 'Active' | 'Banned'
  });
  const [balanceForm, setBalanceForm] = useState({
    amount: '',
    action: 'add' as 'add' | 'deduct' | 'set'
  });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [globalCpmInput, setGlobalCpmInput] = useState('5.00');

  // Fetch all admin workspace parameters
  const fetchAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // 1. Fetch Overview Statistics
      const statsRes = await fetch(`/api/admin/overview/${user.id}`);
      const statsData = await statsRes.json();
      if (statsData.success && statsData.stats) {
        setOverviewStats(statsData.stats);
        if (statsData.stats.globalCpm) {
          setGlobalCpm(statsData.stats.globalCpm);
        }
      }

      // 2. Fetch Users
      const usersRes = await fetch(`/api/admin/users/${user.id}`);
      const usersData = await usersRes.json();
      if (usersData.success && usersData.users) {
        setUsers(usersData.users);
        // Prepopulate individual user CPM inputs
        const initialCpmInputs: Record<string, string> = {};
        usersData.users.forEach((u: User) => {
          initialCpmInputs[u.id] = (u.cpm !== undefined ? u.cpm : 5.00).toFixed(2);
        });
        setUserCpmInputs(initialCpmInputs);
      }

      // 3. Fetch Withdrawals
      const withdrawRes = await fetch(`/api/admin/withdrawals/${user.id}`);
      const withdrawData = await withdrawRes.json();
      if (withdrawData.success && withdrawData.withdrawals) {
        setWithdrawals(withdrawData.withdrawals);
      }

      // 4. Fetch Global CPM from standard stats route
      const globalStatsRes = await fetch('/api/stats');
      const globalStatsData = await globalStatsRes.json();
      if (globalStatsData.success && globalStatsData.stats) {
        setGlobalCpm(globalStatsData.stats.flatCpm);
        setGlobalCpmInput(globalStatsData.stats.flatCpm.toFixed(2));
      }

    } catch (err) {
      showToast('Workspace synchronization failure. Retrying recommended.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user.id]);

  // Helper trigger for toast notifications
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Update Global CPM Configuration
  const handleGlobalCpmUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(globalCpmInput);
    if (isNaN(rate) || rate <= 0) {
      showToast('Please specify a positive CPM number.', 'error');
      return;
    }

    setCpmLoading(true);
    try {
      const response = await fetch('/api/admin/update-global-cpm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user.id, cpm: rate })
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message || 'Global CPM synchronized successfully!', 'success');
        setGlobalCpm(rate);
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to sync Global CPM.', 'error');
      }
    } catch (err) {
      showToast('Network error updating Global CPM rate.', 'error');
    } finally {
      setCpmLoading(false);
    }
  };

  // 2. Save individual user CPM inline
  const handleUserCpmSave = async (targetUserId: string) => {
    const rawCpm = userCpmInputs[targetUserId];
    const rate = parseFloat(rawCpm);
    if (isNaN(rate) || rate <= 0) {
      showToast('Invalid CPM value specified.', 'error');
      return;
    }

    setUserCpmLoading(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: targetUserId,
          cpm: rate
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`User CPM successfully set to $${rate.toFixed(2)}`, 'success');
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to update user CPM.', 'error');
      }
    } catch (err) {
      showToast('Network failure updating user CPM.', 'error');
    } finally {
      setUserCpmLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  // 3. Update Payout/Withdrawal status (Pending, Approved, Rejected, Paid)
  const handleWithdrawalStatusChange = async (transactionId: string, newStatus: 'Pending' | 'Approved' | 'Paid') => {
    setStatusLoadingMap(prev => ({ ...prev, [transactionId]: true }));
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          transactionId,
          status: newStatus
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Ref CTE-${transactionId.replace('#', '')} marked as ${newStatus}`, 'success');
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to change payout state.', 'error');
      }
    } catch (err) {
      showToast('Network connection interrupted.', 'error');
    } finally {
      setStatusLoadingMap(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  // 4. Ban / Unban User direct triggers
  const handleToggleUserBan = async (targetUser: User) => {
    const nextStatus = targetUser.status === 'Banned' || targetUser.isBanned ? 'Active' : 'Banned';
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: targetUser.id,
          status: nextStatus
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`User account is now successfully ${nextStatus === 'Banned' ? 'SUSPENDED/BANNED' : 'ACTIVATED'}`, 'success');
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to change user status.', 'error');
      }
    } catch (err) {
      showToast('Network error updating user status.', 'error');
    }
  };

  // 5. Submit Complete Edit User Modal Form
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.id,
          username: editUserForm.username,
          email: editUserForm.email,
          balance: parseFloat(editUserForm.balance) || 0,
          cpm: parseFloat(editUserForm.cpm) || 5.00,
          status: editUserForm.status
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Administrative credentials synchronized successfully', 'success');
        closeModal();
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to update user variables.', 'error');
      }
    } catch (err) {
      showToast('Connection error updating user profiles.', 'error');
    }
  };

  // 6. Submit Balance adjustment dialog (Add, Deduct, Overwrite)
  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const delta = parseFloat(balanceForm.amount);
    if (isNaN(delta) || delta < 0) {
      showToast('Please enter a valid positive balance modifier.', 'error');
      return;
    }

    let finalBalance = selectedUser.balance;
    if (balanceForm.action === 'add') {
      finalBalance += delta;
    } else if (balanceForm.action === 'deduct') {
      finalBalance = Math.max(0, finalBalance - delta);
    } else {
      finalBalance = delta;
    }

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.id,
          balance: finalBalance
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Balance successfully altered to $${finalBalance.toFixed(4)}`, 'success');
        closeModal();
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to commit balance modification.', 'error');
      }
    } catch (err) {
      showToast('Network error altering user financial ledger.', 'error');
    }
  };

  // 7. Reset User Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (resetPasswordForm.password.length < 6) {
      showToast('Password should be at least 6 characters long.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.id,
          password: resetPasswordForm.password
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Password reset completed successfully!', 'success');
        closeModal();
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to update user password.', 'error');
      }
    } catch (err) {
      showToast('Connection failure resetting user password.', 'error');
    }
  };

  // 8. Delete User fully
  const handleDeleteUserConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.id
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('User and associated records purged successfully.', 'success');
        closeModal();
        fetchAllData(true);
      } else {
        showToast(data.error || 'Purge action failed.', 'error');
      }
    } catch (err) {
      showToast('Purging user generated network connection block.', 'error');
    }
  };

  // Load target user's custom history (withdrawals, links, stats)
  const fetchUserHistory = async (targetUser: User) => {
    setSelectedUser(targetUser);
    setModalType('userHistory');
    setHistoryLoading(true);
    setUserHistoryData({ links: [], withdrawals: [] });

    try {
      // 1. Fetch Links
      const linksResponse = await fetch(`/api/links/my-links/${targetUser.id}`);
      const linksData = await linksResponse.json();
      
      // 2. Fetch Withdrawals
      const withdrawalsResponse = await fetch(`/api/withdrawals/${targetUser.id}`);
      const withdrawalsData = await withdrawalsResponse.json();

      setUserHistoryData({
        links: linksData.success ? linksData.links : [],
        withdrawals: withdrawalsData.success ? withdrawalsData.withdrawals : []
      });
    } catch (err) {
      showToast('Error syncing individual user records history.', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Open modals & initialize form states
  const openModal = (targetUser: User, type: 'profile' | 'editUser' | 'editBalance' | 'resetPassword' | 'deleteConfirm') => {
    setSelectedUser(targetUser);
    setModalType(type);

    if (type === 'editUser') {
      setEditUserForm({
        username: targetUser.username,
        email: targetUser.email,
        balance: targetUser.balance.toString(),
        cpm: (targetUser.cpm !== undefined ? targetUser.cpm : 5.00).toString(),
        status: (targetUser.status === 'Banned' || targetUser.isBanned) ? 'Banned' : 'Active'
      });
    } else if (type === 'editBalance') {
      setBalanceForm({
        amount: '',
        action: 'add'
      });
    } else if (type === 'resetPassword') {
      setResetPasswordForm({
        password: '',
        confirmPassword: ''
      });
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  // Search & Filter parsing routines
  const getFilteredUsers = () => {
    return users.filter(u => {
      // 1. Search Query Match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        u.id.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query);

      // 2. Status Filter Match
      const isBannedUser = u.status === 'Banned' || u.isBanned;
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'Active' && !isBannedUser) ||
        (statusFilter === 'Banned' && isBannedUser);

      return matchSearch && matchStatus;
    }).sort((a, b) => {
      // 3. Sort Order Implementation
      let valA: any = a[userSortKey] !== undefined ? a[userSortKey] : '';
      let valB: any = b[userSortKey] !== undefined ? b[userSortKey] : '';

      // Handle numbers specifically
      if (typeof valA === 'number' && typeof valB === 'number') {
        return userSortOrder === 'asc' ? valA - valB : valB - valA;
      }
      
      // Strings comparison
      return userSortOrder === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  };

  const getFilteredWithdrawals = () => {
    return withdrawals.filter(w => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        w.transaction_id.toLowerCase().includes(query) ||
        w.userId.toLowerCase().includes(query) ||
        w.username.toLowerCase().includes(query) ||
        w.payoutDetails.toLowerCase().includes(query);

      const matchStatus = withdrawFilter === 'all' || w.status === withdrawFilter;

      return matchSearch && matchStatus;
    });
  };

  // Calculate quick metrics
  const sortedAndFilteredUsers = getFilteredUsers();
  const sortedAndFilteredWithdrawals = getFilteredWithdrawals();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative font-sans overflow-x-hidden" id="admin-dashboard-container">
      {/* Cyber Grid Canvas Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Persistent Admin Toast Notifications */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-4 rounded-xl border shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-slideIn ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-950/90 border-rose-500/30 text-rose-400'
          }`}
          id="admin-alert-toast"
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span className="text-xs font-bold font-mono uppercase tracking-wide">{toast.message}</span>
          <button onClick={() => setToast(null)} className="hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Master Core Workspace Grid Layout */}
      <div className="flex min-h-screen">
        
        {/* SIDEBAR NAVIGATION PANEL */}
        <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between p-6 shrink-0 z-20 sticky top-0 h-screen" id="admin-sidebar-navigation">
          <div className="space-y-8">
            {/* Master Identity Header */}
            <div className="flex items-center space-x-3 pb-6 border-b border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wider text-white">CTE MASTER</h1>
                <p className="text-[10px] text-pink-500 font-bold tracking-widest uppercase">CONTROL GATEWAY</p>
              </div>
            </div>

            {/* Admin Session Identity Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[9px] text-slate-500 font-mono block mb-1">OPERATOR AUTHORIZATION</span>
              <span className="text-xs font-bold text-slate-200 block truncate" title={user.email}>{user.email}</span>
              <span className="inline-flex items-center gap-1 text-[9px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md font-mono mt-2 border border-pink-500/10 font-bold">
                <Check className="w-2.5 h-2.5" /> ROOT_ADMIN_OK
              </span>
            </div>

            {/* Nav Menu Tab items */}
            <nav className="space-y-1.5" id="admin-nav-tabs">
              <button
                onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/5 border-l-4 border-pink-500 text-pink-400 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/35'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>DASHBOARD OVERVIEW</span>
              </button>

              <button
                onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-cyan-500/10 to-emerald-500/5 border-l-4 border-cyan-500 text-cyan-400 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/35'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>USER LEDGER</span>
              </button>

              <button
                onClick={() => { setActiveTab('withdrawals'); setSearchQuery(''); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'withdrawals'
                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-l-4 border-amber-500 text-amber-400 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/35'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>WITHDRAWALS ({withdrawals.filter(w => w.status === 'Pending').length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border-l-4 border-purple-500 text-purple-400 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/35'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>SYSTEM CONSTANTS</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Logout Block */}
          <div className="pt-6 border-t border-slate-800/80">
            <button
              onClick={onLogout}
              className="w-full bg-slate-950 border border-slate-800/80 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-rose-400 font-black text-xs px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
              id="sidebar-logout-trigger"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="flex-1 min-h-screen p-8 md:p-10 relative space-y-8 max-w-[calc(100vw-256px)]" id="admin-main-viewport">
          
          {/* HEADER METADATA */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/60 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest font-mono">SECURE SYSTEM INSTANCE</span>
                <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  LIVE DB SYNCHRONIZED
                </span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {activeTab === 'overview' && 'SYSTEM SUMMARY MONITOR'}
                {activeTab === 'users' && 'MASTER USER ACCOUNT REGISTRY'}
                {activeTab === 'withdrawals' && 'PAYOUT AUTHORIZATION CONTROL'}
                {activeTab === 'settings' && 'GLOBAL ARCHITECTURAL TUNING'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'overview' && 'Comprehensive platform telemetry, active user click yields, and gross financial metrics.'}
                {activeTab === 'users' && 'Inspect profiles, modify ledgers, adjust parameters, execute account suspensions, or reset security keys.'}
                {activeTab === 'withdrawals' && 'Approve payment hashes, audit details, transition states, and wire withdrawals.'}
                {activeTab === 'settings' && 'Tweak platform CPM parameters and synchronize database configuration models.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => fetchAllData()}
                disabled={loading}
                className="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-pink-500/20 text-slate-300 font-black px-4 py-2.5 rounded-xl hover:text-white text-xs flex items-center space-x-1.5 transition cursor-pointer"
                id="admin-sync-all-btn"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Refreshed...' : 'Sync Records'}</span>
              </button>
            </div>
          </div>

          {/* Loading backdrop container */}
          {loading && !overviewStats ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4" id="admin-loading-indicator">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Awaiting local datastore packet stream...</p>
            </div>
          ) : (
            <>
              
              {/* TAB 1: SYSTEM OVERVIEW */}
              {activeTab === 'overview' && overviewStats && (
                <div className="space-y-8" id="tab-overview-pane">
                  
                  {/* METRIC BENTO GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="overview-bento-grid">
                    {/* Registered Users */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">REGISTRY SIZE</span>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 p-2 rounded-lg">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-3xl font-black text-white block font-mono">{overviewStats.totalRegisteredUsers}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 mt-2 font-mono">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{overviewStats.totalActiveUsers} active administrators / operators</span>
                      </div>
                    </div>

                    {/* Shortened Links */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">SHORTENED LINKS</span>
                        <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 p-2 rounded-lg">
                          <LinkIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-3xl font-black text-white block font-mono">{overviewStats.totalShortenedLinks.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-pink-400 mt-2 font-mono">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Today: +{overviewStats.today.linksCreated} redirection records</span>
                      </div>
                    </div>

                    {/* Total Clicks */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">TOTAL WEB CLICKS</span>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                          <MousePointerClick className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-3xl font-black text-white block font-mono">{overviewStats.totalClicks.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-2 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Avg. {((overviewStats.totalClicks - 150000) / (overviewStats.totalRegisteredUsers || 1)).toFixed(1)} click yields per user</span>
                      </div>
                    </div>

                    {/* Total Platform Balance */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/60 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">PLATFORM LEDGER TOTAL</span>
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2 rounded-lg">
                          <Coins className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="text-3xl font-black text-white block font-mono">${overviewStats.totalPlatformBalance.toFixed(2)}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-400 mt-2 font-mono">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>USD locked in user wallets</span>
                      </div>
                    </div>
                  </div>

                  {/* DOUBLE COLUMN STATS & ADVANCED GRAPHICS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-secondary-details">
                    
                    {/* CHART WORKSPACE */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6" id="overview-chart-box">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/60 pb-4">
                        <div>
                          <h3 className="font-extrabold text-sm text-white font-mono uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-pink-500" />
                            <span>PLATFORM HISTORIC LOG CURVE (7 DAYS)</span>
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Interactive projection mapping daily click conversions and short links.</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-mono font-bold">
                          <span className="flex items-center gap-1.5 text-pink-500">
                            <span className="w-2.5 h-2.5 rounded bg-pink-500 inline-block"></span> LINKS CREATED
                          </span>
                          <span className="flex items-center gap-1.5 text-cyan-500">
                            <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block"></span> VISITOR CLICKS
                          </span>
                        </div>
                      </div>

                      {/* STUNNING HIGH-PRECISION DYNAMIC SVG GRAPHICS */}
                      <div className="relative h-60 w-full flex items-end">
                        {/* Background grid lines */}
                        <div className="absolute inset-x-0 inset-y-1 bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100%_2.5rem] opacity-35"></div>
                        
                        <div className="w-full h-full flex items-end justify-between relative pt-8 px-2">
                          {/* Polyline vector rendering of historical activity curves */}
                          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="glow-pink" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25"/>
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0"/>
                              </linearGradient>
                              <linearGradient id="glow-cyan" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                              </linearGradient>
                            </defs>
                            
                            {/* SVG Render loops path for 7 values */}
                            {(() => {
                              const pointsLinks = overviewStats.chartData.map((d, idx) => {
                                const x = (idx / 6) * 100; // percent
                                // map links range dynamically (min 0 max 100)
                                const val = Math.min(100, Math.max(10, d.links));
                                const y = 100 - val; // percent inverted
                                return `${x}%,${y}%`;
                              });
                              const pointsClicks = overviewStats.chartData.map((d, idx) => {
                                const x = (idx / 6) * 100; // percent
                                // map clicks range (min 100 max 1500)
                                const val = Math.min(100, Math.max(15, (d.clicks / 15)));
                                const y = 100 - val;
                                return `${x}%,${y}%`;
                              });

                              return (
                                <>
                                  {/* Shadow Area under curves */}
                                  <path
                                    d={`M 0%,100% L ${pointsLinks.map(p => p.replace(/%/g, '')).join(' L ')} L 100%,100% Z`}
                                    fill="url(#glow-pink)"
                                    className="transition-all duration-300"
                                  />
                                  <path
                                    d={`M 0%,100% L ${pointsClicks.map(p => p.replace(/%/g, '')).join(' L ')} L 100%,100% Z`}
                                    fill="url(#glow-cyan)"
                                    className="transition-all duration-300"
                                  />

                                  {/* Primary Stroke Lines */}
                                  <path
                                    d={`M ${pointsLinks.map(p => p.replace(/%/g, '')).join(' L ')}`}
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="2.5"
                                    className="transition-all duration-300"
                                  />
                                  <path
                                    d={`M ${pointsClicks.map(p => p.replace(/%/g, '')).join(' L ')}`}
                                    fill="none"
                                    stroke="#06b6d4"
                                    strokeWidth="2.5"
                                    className="transition-all duration-300"
                                  />
                                </>
                              );
                            })()}
                          </svg>

                          {/* Dots / Markers mapping */}
                          {overviewStats.chartData.map((d, idx) => {
                            const lValue = Math.min(100, Math.max(10, d.links));
                            const cValue = Math.min(100, Math.max(15, (d.clicks / 15)));
                            
                            return (
                              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-between z-10 relative group">
                                <div className="absolute top-0 text-[9px] font-bold font-mono bg-slate-900 border border-slate-800 text-slate-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 -translate-y-2 select-none">
                                  <span>{d.clicks} hits / {d.links} links</span>
                                </div>
                                <div className="h-full w-full flex items-center justify-center relative">
                                  {/* Hover helper tracking columns */}
                                  <div className="absolute inset-y-0 w-px bg-slate-800/40 group-hover:bg-slate-700/60 pointer-events-none"></div>
                                  
                                  {/* Pink point */}
                                  <span 
                                    className="absolute w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-slate-950 shadow-[0_0_8px_#ec4899] cursor-pointer"
                                    style={{ bottom: `${lValue}%`, transform: 'translateY(50%)' }}
                                  ></span>

                                  {/* Cyan point */}
                                  <span 
                                    className="absolute w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-slate-950 shadow-[0_0_8px_#06b6d4] cursor-pointer"
                                    style={{ bottom: `${cValue}%`, transform: 'translateY(50%)' }}
                                  ></span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2 select-none">
                                  {d.date.slice(5)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* WITHDRAWALS OUTSTANDING LEDGER */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6" id="overview-finances-box">
                      <div className="border-b border-slate-800/60 pb-4">
                        <h3 className="font-extrabold text-sm text-white font-mono uppercase tracking-wide flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-400" />
                          <span>FINANCIAL CLEARING LOG</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Authorizations queue statistics for withdrawal payloads.</p>
                      </div>

                      <div className="space-y-4 font-mono">
                        {/* Pending Volume */}
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AWAITING REVIEW</span>
                            <span className="text-sm font-black text-amber-400 block">{overviewStats.totalPendingWithdrawals} Pending payouts</span>
                          </div>
                          <span className="text-xl font-black text-white">${overviewStats.totalPendingWithdrawalsAmount.toFixed(2)}</span>
                        </div>

                        {/* Paid Volume */}
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">SUCCESSFULLY TRANSFERRED</span>
                            <span className="text-sm font-black text-emerald-400 block">{overviewStats.totalPaidWithdrawals} Disbursed</span>
                          </div>
                          <span className="text-xl font-black text-white">${overviewStats.totalPaidWithdrawalsAmount.toFixed(2)}</span>
                        </div>

                        {/* Cumulative Platform Revenue */}
                        <div className="p-4 rounded-xl bg-gradient-to-tr from-pink-500/10 to-transparent border border-pink-500/20 flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-pink-400 uppercase font-bold tracking-wider">ESTIMATED SPONSOR INCOME</span>
                            <span className="text-sm font-black text-pink-300 block">Gross Revenue Yield</span>
                          </div>
                          <span className="text-xl font-black text-white">${overviewStats.totalRevenue.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Today's Stats indicators */}
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-widest block mb-2">TELEMETRY WINDOW: TODAY</span>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                            <span className="text-slate-400 text-[9px] font-bold font-mono block">SIGNUPS</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">+{overviewStats.today.usersRegistered}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                            <span className="text-slate-400 text-[9px] font-bold font-mono block">LINKS</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">+{overviewStats.today.linksCreated}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                            <span className="text-slate-400 text-[9px] font-bold font-mono block font-mono">HITS</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">+{overviewStats.today.clicksLogged}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6" id="tab-users-pane">
                  
                  {/* UTILITIES & FILTERS HEADER */}
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4" id="users-search-filters">
                    
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md w-full">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search by Username, Email, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
                        id="user-search-input"
                      />
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Status Filter */}
                      <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                        <Filter className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wide">Status:</span>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as any)}
                          className="bg-transparent text-slate-200 text-[11px] font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="all">ALL USERS</option>
                          <option value="Active">ACTIVE ONLY</option>
                          <option value="Banned">BANNED ONLY</option>
                        </select>
                      </div>

                      {/* Sorting filter dropdown */}
                      <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wide">Sort By:</span>
                        <select
                          value={userSortKey}
                          onChange={(e) => setUserSortKey(e.target.value as any)}
                          className="bg-transparent text-slate-200 text-[11px] font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="createdAt">REGISTRATION DATE</option>
                          <option value="username">ALPHABETICAL NAME</option>
                          <option value="balance">CURRENT WALLET BALANCE</option>
                          <option value="clicks">TOTAL AD HITS</option>
                        </select>
                        <button
                          onClick={() => setUserSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="text-slate-400 hover:text-white transition px-1 text-[10px] font-bold font-mono"
                        >
                          {userSortOrder === 'asc' ? '▲' : '▼'}
                        </button>
                      </div>

                      {/* Results Counter */}
                      <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-3 py-2 rounded-xl font-mono font-bold">
                        FOUND: {sortedAndFilteredUsers.length} OPERATIVES
                      </span>

                    </div>
                  </div>

                  {/* HIGH PRECISION ACCOUNTS DATATABLE */}
                  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden" id="users-datatable-box">
                    {sortedAndFilteredUsers.length === 0 ? (
                      <div className="text-center py-24 border border-dashed border-slate-800/60 m-4 rounded-xl" id="users-ledger-empty">
                        <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-400">No users found matching query</h4>
                        <p className="text-xs text-slate-500 mt-1">Adjust search parameters or clear filters.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/40">
                              <th className="py-4 px-5">Account Details</th>
                              <th className="py-4 px-4">Financial Records</th>
                              <th className="py-4 px-4">Yield CPM</th>
                              <th className="py-4 px-4">Link Analytics</th>
                              <th className="py-4 px-4">Referrals</th>
                              <th className="py-4 px-4">Registration</th>
                              <th className="py-4 px-5 text-right">Administrative Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                            {sortedAndFilteredUsers.map((u) => {
                              const isBanned = u.status === 'Banned' || u.isBanned;
                              
                              return (
                                <tr key={u.id} className={`hover:bg-slate-950/25 transition-all duration-150 ${isBanned ? 'bg-rose-950/5' : ''}`}>
                                  {/* Profile metadata */}
                                  <td className="py-4 px-5">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] font-mono shrink-0 ${
                                        isBanned ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' : 'bg-slate-800 border border-slate-700 text-slate-300'
                                      }`}>
                                        {u.username.slice(0, 2).toUpperCase()}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`font-black text-white truncate ${isBanned ? 'line-through text-slate-500' : ''}`}>
                                            {u.username}
                                          </span>
                                          {u.isAdmin && (
                                            <span className="text-[8px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono font-bold px-1 rounded">
                                              SYS_ADMIN
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 block truncate font-mono">{u.email}</span>
                                        <span className="text-[8px] text-slate-600 block truncate font-mono">UID: {u.id}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Financial balance ledgers */}
                                  <td className="py-4 px-4">
                                    <span className="font-extrabold text-white block font-mono">${u.balance.toFixed(4)}</span>
                                    <span className="text-[10px] text-slate-500 block font-mono">Total Earned: ${(u.balance + 10.00).toFixed(2)}</span>
                                  </td>

                                  {/* CPM Configuration Block */}
                                  <td className="py-4 px-4 min-w-[130px]">
                                    <div className="flex items-center gap-1.5">
                                      <div className="relative">
                                        <span className="absolute left-1.5 top-1.5 text-[10px] text-slate-500 font-bold">$</span>
                                        <input
                                          type="text"
                                          value={userCpmInputs[u.id] !== undefined ? userCpmInputs[u.id] : '5.00'}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setUserCpmInputs(prev => ({ ...prev, [u.id]: val }));
                                          }}
                                          className="w-14 bg-slate-950 border border-slate-800 rounded pl-4 pr-1 py-1 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                                        />
                                      </div>
                                      <button
                                        onClick={() => handleUserCpmSave(u.id)}
                                        disabled={userCpmLoading[u.id]}
                                        className="bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 p-1 rounded transition-all cursor-pointer disabled:opacity-50"
                                        title="Save CPM rate"
                                      >
                                        {userCpmLoading[u.id] ? (
                                          <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Save className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </td>

                                  {/* Link Analytics */}
                                  <td className="py-4 px-4">
                                    <span className="font-bold text-slate-300 block font-mono">{u.totalClicks} clicks</span>
                                    <span className="text-[10px] text-slate-500 block font-mono">{(u as any).linksCount || 0} links created</span>
                                  </td>

                                  {/* Referrals */}
                                  <td className="py-4 px-4 font-mono text-slate-400 font-bold">
                                    {(u as any).referralCount || 0} referrals
                                  </td>

                                  {/* Registration metadata */}
                                  <td className="py-4 px-4 font-mono">
                                    <span className="text-[11px] text-slate-400 block">{new Date(u.createdAt).toLocaleDateString()}</span>
                                    <span className="text-[9px] text-slate-500 block">Status: 
                                      <span className={`ml-1 font-black ${isBanned ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {isBanned ? 'BANNED' : 'ACTIVE'}
                                      </span>
                                    </span>
                                  </td>

                                  {/* Actions Drawer button triggers */}
                                  <td className="py-4 px-5 text-right min-w-[220px]">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => fetchUserHistory(u)}
                                        className="p-1.5 bg-slate-950 border border-slate-800/80 hover:border-indigo-500 hover:text-indigo-400 text-slate-400 rounded-lg transition"
                                        title="View History / Links"
                                      >
                                        <History className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => openModal(u, 'editBalance')}
                                        className="p-1.5 bg-slate-950 border border-slate-800/80 hover:border-amber-500 hover:text-amber-400 text-slate-400 rounded-lg transition"
                                        title="Adjust Balance"
                                      >
                                        <Coins className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => openModal(u, 'editUser')}
                                        className="p-1.5 bg-slate-950 border border-slate-800/80 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 rounded-lg transition"
                                        title="Edit Profile details"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => handleToggleUserBan(u)}
                                        className={`p-1.5 bg-slate-950 border border-slate-800/80 rounded-lg transition ${
                                          isBanned 
                                            ? 'hover:border-emerald-500 hover:text-emerald-400 text-rose-500/60' 
                                            : 'hover:border-rose-500 hover:text-rose-400 text-slate-400'
                                        }`}
                                        title={isBanned ? 'Unban Operative' : 'Ban/Suspend Operative'}
                                      >
                                        {isBanned ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                      </button>

                                      <button
                                        onClick={() => openModal(u, 'deleteConfirm')}
                                        disabled={u.id === user.id}
                                        className="p-1.5 bg-slate-950 border border-slate-800/80 hover:border-rose-500 hover:text-rose-400 text-slate-400 rounded-lg transition disabled:opacity-30"
                                        title="Delete User Purge"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
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
              )}

              {/* TAB 3: WITHDRAWAL MANAGEMENT */}
              {activeTab === 'withdrawals' && (
                <div className="space-y-6" id="tab-withdrawals-pane">
                  
                  {/* SEARCH & FILTER CONTROLS */}
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4" id="withdrawals-search-filters">
                    
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md w-full">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search by Transaction ID, wallet address, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
                        id="withdrawal-search-input"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Withdrawal status dropdown filter */}
                      <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                        <Filter className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wide">Payout Status:</span>
                        <select
                          value={withdrawFilter}
                          onChange={(e) => setWithdrawFilter(e.target.value as any)}
                          className="bg-transparent text-slate-200 text-[11px] font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="all">ALL WITHDRAWALS</option>
                          <option value="Pending">PENDING ONLY</option>
                          <option value="Approved">APPROVED ONLY</option>
                          <option value="Paid">PAID ONLY</option>
                        </select>
                      </div>

                      {/* Count Display */}
                      <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-3 py-2 rounded-xl font-mono font-bold">
                        MATCHED PAYOUTS: {sortedAndFilteredWithdrawals.length}
                      </span>

                    </div>
                  </div>

                  {/* MASTER TRANSACTION LEDGER */}
                  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden" id="payout-master-table">
                    {sortedAndFilteredWithdrawals.length === 0 ? (
                      <div className="text-center py-24 border border-dashed border-slate-800/60 m-4 rounded-xl" id="withdrawals-master-empty">
                        <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-400">No payouts in current filter</h4>
                        <p className="text-xs text-slate-500 mt-1">Pending payout queries will populate here once filed by users.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/40">
                              <th className="py-4 px-5">User & Email Info</th>
                              <th className="py-4 px-4">Transaction ID</th>
                              <th className="py-4 px-4">Withdraw Amount</th>
                              <th className="py-4 px-4">Payout Method / Gateway Details</th>
                              <th className="py-4 px-4">Requested Date</th>
                              <th className="py-4 px-5 text-right">Process Authorization</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                            {sortedAndFilteredWithdrawals.map((w) => {
                              
                              return (
                                <tr key={w.id} className="hover:bg-slate-950/20 transition-all duration-150">
                                  {/* User Details */}
                                  <td className="py-4 px-5">
                                    <span className="font-extrabold text-white block">{w.username}</span>
                                    <span className="text-[10px] text-slate-500 block font-mono">ID: {w.userId}</span>
                                  </td>

                                  {/* Transaction Reference ID */}
                                  <td className="py-4 px-4 text-pink-500 font-extrabold font-mono">
                                    {w.transaction_id}
                                  </td>

                                  {/* Amount */}
                                  <td className="py-4 px-4">
                                    <span className="font-black text-white font-mono block text-sm">${w.amount.toFixed(2)}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">USD Net yield</span>
                                  </td>

                                  {/* Method & Address Details */}
                                  <td className="py-4 px-4 max-w-[280px]">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold tracking-wide uppercase mb-1">
                                      {w.payoutMethod}
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-400 block truncate" title={w.payoutDetails}>
                                      {w.payoutDetails}
                                    </span>
                                  </td>

                                  {/* File Date */}
                                  <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                                    {new Date(w.createdAt).toLocaleDateString()}
                                    <span className="text-[9px] text-slate-600 block mt-0.5">{new Date(w.createdAt).toLocaleTimeString()}</span>
                                  </td>

                                  {/* State dropdown */}
                                  <td className="py-4 px-5 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      {statusLoadingMap[w.transaction_id] && (
                                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                                      )}
                                      <select
                                        disabled={statusLoadingMap[w.transaction_id]}
                                        value={w.status}
                                        onChange={(e) => handleWithdrawalStatusChange(w.transaction_id, e.target.value as any)}
                                        className={`border text-xs font-bold rounded px-2.5 py-1.5 focus:outline-none cursor-pointer font-mono ${
                                          w.status === 'Paid' 
                                            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
                                            : w.status === 'Approved'
                                            ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-300'
                                        }`}
                                      >
                                        <option value="Pending">Pending Review</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Paid">Processed (Paid)</option>
                                      </select>
                                    </div>
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
              )}

              {/* TAB 4: SYSTEM SETTINGS (GLOBAL CONSTANTS) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl" id="tab-settings-pane">
                  
                  {/* Global CPM Control */}
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800/80 pb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-pink-500" />
                      <div>
                        <h3 className="font-extrabold text-base text-white">Global CPM Override Utility</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Define platform CPM rates across the active datastore cluster.</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Altering the flat CPM rate here will initiate an immediate bulk update script in the database.
                      This replaces the specific CPM settings for <strong>every single user account</strong> instantly,
                      while setting the platform-wide fallback CPM default.
                    </p>

                    <form onSubmit={handleGlobalCpmUpdate} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <div className="relative flex-1 w-full">
                        <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          step="0.05"
                          min="0.10"
                          placeholder="e.g. 5.00"
                          required
                          value={globalCpmInput}
                          onChange={(e) => setGlobalCpmInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 font-mono font-bold"
                          id="global-cpm-form-input"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={cpmLoading}
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-pink-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-40"
                      >
                        {cpmLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Commit Bulk CPM Update</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Architecture & Infrastructure diagnostics */}
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800/80 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h3 className="font-extrabold text-base text-white">Platform Environmental Variables</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Cryptographic integrity signatures and service endpoints.</p>
                      </div>
                    </div>

                    <div className="space-y-2 font-mono text-[10px] text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <div><span className="text-pink-500 font-bold">DATABASE_SERVICE:</span> LOCAL_FS_PERSISTENCE (server_db.json)</div>
                      <div><span className="text-pink-500 font-bold">TLS_STATUS:</span> ENABLED_SSL_SECURE</div>
                      <div><span className="text-pink-500 font-bold">API_GATEWAY_INTEGRITY:</span> CTE-SECURED-MD5</div>
                      <div><span className="text-pink-500 font-bold">SPONSOR_AD_IMPRESSIONS:</span> SPOOF-PROFILED-AD_YIELDS</div>
                    </div>
                  </div>

                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* ======================================= */}
      {/* ADMINISTRATIVE ACTIONS MODALS / DIALOGS */}
      {/* ======================================= */}

      {modalType && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" id="admin-actions-modal">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500"></div>

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 p-2 rounded-xl">
                  {modalType === 'editUser' && <Edit3 className="w-5 h-5" />}
                  {modalType === 'editBalance' && <Coins className="w-5 h-5" />}
                  {modalType === 'resetPassword' && <Key className="w-5 h-5" />}
                  {modalType === 'userHistory' && <History className="w-5 h-5" />}
                  {modalType === 'deleteConfirm' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white font-mono uppercase tracking-wider">
                    {modalType === 'editUser' && 'Sync Accounts Credentials'}
                    {modalType === 'editBalance' && 'Balance Ledger Adjuster'}
                    {modalType === 'resetPassword' && 'Security Reset Gateway'}
                    {modalType === 'userHistory' && 'User Operational Audit'}
                    {modalType === 'deleteConfirm' && 'CRITICAL PURGE CONFIRMATION'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold tracking-wide mt-0.5 uppercase">Operative: {selectedUser.username}</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scroll container */}
            <div className="p-6 overflow-y-auto flex-1">

              {/* MODAL ACTION FORM 1: EDIT USER CREDENTIALS */}
              {modalType === 'editUser' && (
                <form onSubmit={handleEditUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Username</label>
                      <input
                        type="text"
                        required
                        value={editUserForm.username}
                        onChange={(e) => setEditUserForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={editUserForm.email}
                        onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Current Balance ($)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={editUserForm.balance}
                        onChange={(e) => setEditUserForm(prev => ({ ...prev, balance: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">User CPM ($)</label>
                      <input
                        type="number"
                        step="0.05"
                        required
                        value={editUserForm.cpm}
                        onChange={(e) => setEditUserForm(prev => ({ ...prev, cpm: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Account Status</label>
                    <select
                      value={editUserForm.status}
                      onChange={(e) => setEditUserForm(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-bold"
                    >
                      <option value="Active">Active Clearance</option>
                      <option value="Banned">Banned/Suspended</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-6">
                    <button 
                      type="button" 
                      onClick={closeModal}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-black hover:text-white transition text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black hover:brightness-110 transition text-xs cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL ACTION FORM 2: BALANCE MANAGER */}
              {modalType === 'editBalance' && (
                <form onSubmit={handleBalanceSubmit} className="space-y-4">
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between font-mono">
                    <span className="text-slate-500 text-xs font-bold uppercase">LEDGER VALUE</span>
                    <span className="text-base font-black text-white">${selectedUser.balance.toFixed(4)} USD</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Modification Vector</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setBalanceForm(prev => ({ ...prev, action: 'add' }))}
                        className={`py-2 rounded-lg text-xs font-black tracking-wider flex items-center justify-center space-x-1 border cursor-pointer transition ${
                          balanceForm.action === 'add'
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBalanceForm(prev => ({ ...prev, action: 'deduct' }))}
                        className={`py-2 rounded-lg text-xs font-black tracking-wider flex items-center justify-center space-x-1 border cursor-pointer transition ${
                          balanceForm.action === 'deduct'
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <MinusCircle className="w-3.5 h-3.5" />
                        <span>DEDUCT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBalanceForm(prev => ({ ...prev, action: 'set' }))}
                        className={`py-2 rounded-lg text-xs font-black tracking-wider flex items-center justify-center space-x-1 border cursor-pointer transition ${
                          balanceForm.action === 'set'
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>OVERWRITE</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Adjustment Amount ($)</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="e.g. 5.2500"
                      value={balanceForm.amount}
                      onChange={(e) => setBalanceForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2.5 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-mono font-bold"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-6">
                    <button 
                      type="button" 
                      onClick={closeModal}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-black hover:text-white transition text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black hover:brightness-110 transition text-xs cursor-pointer"
                    >
                      Execute Ledger Adjustment
                    </button>
                  </div>

                </form>
              )}

              {/* MODAL ACTION FORM 3: RESET PASSWORD */}
              {modalType === 'resetPassword' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">New Security Key</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={resetPasswordForm.password}
                      onChange={(e) => setResetPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Confirm Security Key</label>
                    <input
                      type="password"
                      required
                      value={resetPasswordForm.confirmPassword}
                      onChange={(e) => setResetPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 pl-3.5 pr-3 py-2 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-6">
                    <button 
                      type="button" 
                      onClick={closeModal}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-black hover:text-white transition text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black hover:brightness-110 transition text-xs cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL ACTION FORM 4: AUDIT HISTORY (LINKS & WITHDRAWALS) */}
              {modalType === 'userHistory' && (
                <div className="space-y-6">
                  {historyLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2">
                      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Syncing operational audits...</p>
                    </div>
                  ) : (
                    <>
                      {/* Short Links Ledger */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-[11px] text-pink-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Short Redirection Links ({userHistoryData.links.length})</span>
                        </h4>

                        {userHistoryData.links.length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic py-2">No links created by this user yet.</p>
                        ) : (
                          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-800 divide-y divide-slate-800/40 bg-slate-950/60">
                            {userHistoryData.links.map(link => (
                              <div key={link.id} className="p-2.5 text-[11px] flex justify-between gap-4 hover:bg-slate-950 transition font-mono">
                                <div className="truncate min-w-0">
                                  <span className="text-white font-bold block truncate" title={link.originalUrl}>{link.originalUrl}</span>
                                  <span className="text-[10px] text-pink-400">Code: {link.shortCode}</span>
                                </div>
                                <span className="font-black text-slate-300 shrink-0">{link.clicksCount} clicks</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* User Specific Withdrawals ledger */}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-[11px] text-amber-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Payout Transaction logs ({userHistoryData.withdrawals.length})</span>
                        </h4>

                        {userHistoryData.withdrawals.length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic py-2">No withdrawal payouts logged.</p>
                        ) : (
                          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-800 divide-y divide-slate-800/40 bg-slate-950/60">
                            {userHistoryData.withdrawals.map(w => (
                              <div key={w.id} className="p-2.5 text-[11px] flex justify-between gap-4 hover:bg-slate-950 transition font-mono">
                                <div>
                                  <span className="text-white font-bold block">{w.transaction_id} ({w.payoutMethod})</span>
                                  <span className="text-[10px] text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-white font-black block">${w.amount.toFixed(2)}</span>
                                  <span className={`text-[10px] font-bold ${
                                    w.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                                  }`}>{w.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-4 flex justify-end border-t border-slate-800/60 mt-6">
                    <button 
                      onClick={closeModal}
                      className="px-5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-black hover:text-white transition text-xs cursor-pointer"
                    >
                      Audit OK
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL ACTION FORM 5: PURGE DELETE CONFIRM */}
              {modalType === 'deleteConfirm' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-start space-x-3 leading-relaxed">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">CRITICAL WARNING: PURGE_USER</p>
                      <p className="mt-1">
                        You are about to permanently delete <strong>{selectedUser.username}</strong> from Click-To-Earn datastore.
                        This will instantly wipe their user records, balance registries, and all associated shortened hyperlinks!
                      </p>
                      <p className="font-bold mt-2">THIS ACTION IS ABSOLUTELY IRREVERSIBLE.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-6">
                    <button 
                      onClick={closeModal}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-black hover:text-white transition text-xs cursor-pointer"
                    >
                      Abort Purge
                    </button>
                    <button 
                      onClick={handleDeleteUserConfirm}
                      className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-black hover:bg-rose-600 transition text-xs cursor-pointer"
                    >
                      Purge Account Database Records
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
