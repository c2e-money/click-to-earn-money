import React, { useState, useEffect } from 'react';
import { User, Withdrawal } from '../types';
import { CreditCard, DollarSign, Send, Gift, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface WithdrawalHistoryProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export default function WithdrawalHistory({ user, onUserUpdate }: WithdrawalHistoryProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'UPI' | 'PayPal' | 'Payeer' | 'USDT'>('UPI');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchWithdrawals = async () => {
    try {
      // Sync user profile to get latest balance
      const profileRes = await fetch(`/api/user/profile/${user.id}`);
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        onUserUpdate(profileData.user);
      }

      // Sync withdrawals
      const response = await fetch(`/api/withdrawals/${user.id}`);
      const data = await response.json();
      if (data.success && data.withdrawals) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error('Failed to sync withdrawals:', err);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !payoutDetails) {
      setError('Please provide the withdrawal amount and payout address details.');
      return;
    }

    const val = parseFloat(amount);
    if (isNaN(val) || val < 1.00) {
      setError('Minimum withdrawal limit is strictly $1.00.');
      return;
    }

    if (val > user.balance) {
      setError('Insufficient available balance to complete this transaction.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: val,
          payoutMethod,
          payoutDetails
        })
      });

      const data = await response.json();
      if (data.success && data.withdrawal) {
        setSuccessMsg(`Withdrawal submitted successfully! Your Unique Transaction ID is ${data.withdrawal.transaction_id}. Please wait while our team reviews the payout.`);
        setAmount('');
        setPayoutDetails('');
        // Refresh withdrawal table and balance
        fetchWithdrawals();
      } else {
        setError(data.error || 'Failed to submit withdrawal request.');
      }
    } catch (err) {
      setError('Failed to contact withdrawal server. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8" id="withdrawal-page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">PAYOUT SYSTEM</span>
          <h2 className="text-3xl font-black text-white">Withdraw Earnings</h2>
          <p className="text-xs text-slate-400 mt-1">Get paid daily. Submit your withdrawal request via multiple secure payment channels.</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Request Payout Form */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800" id="withdraw-form-container">
            <h3 className="font-extrabold text-lg text-white mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Request Payout</span>
            </h3>

            {/* Quick Balance Status */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 mb-6 flex justify-between items-center" id="withdraw-payout-stats">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Your Balance</span>
                <span className="text-2xl font-black text-emerald-400 font-mono" id="withdraw-current-balance">${user.balance.toFixed(4)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Min Limit</span>
                <span className="text-sm font-bold text-slate-100">$1.00 USD</span>
              </div>
            </div>

            {successMsg && (
              <div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start space-x-2 animate-fadeIn" id="withdraw-success-alert">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-shake" id="withdraw-error-alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="withdraw-form">
              {/* Amount */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">Withdrawal Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="1.00"
                    max={user.balance}
                    placeholder="e.g. 5.00"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    id="withdraw-amount-input"
                  />
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">Payment Channel</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  id="withdraw-method-select"
                >
                  <option value="UPI">UPI (India Quick Transfer)</option>
                  <option value="PayPal">PayPal (Global Payout)</option>
                  <option value="Payeer">Payeer Account</option>
                  <option value="USDT">Crypto - USDT (TRC-20)</option>
                </select>
              </div>

              {/* Details */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-1.5">Payment Details / Account Address</label>
                <textarea
                  required
                  rows={3}
                  placeholder={
                    payoutMethod === 'UPI' ? 'Enter UPI ID (e.g. user@ybl or user@paytm)' :
                    payoutMethod === 'PayPal' ? 'Enter PayPal email address' :
                    payoutMethod === 'Payeer' ? 'Enter Payeer Account ID (e.g. P10023456)' :
                    'Enter your USDT wallet address (TRC-20 network only!)'
                  }
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono resize-none"
                  id="withdraw-details-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading || user.balance < 1.00}
                className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-lg hover:brightness-110 shadow-[0_4px_15px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-1 transition cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
                id="withdraw-submit-btn"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Submit Payout Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Withdrawal History List */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[460px]" id="withdraw-history-container">
            <div>
              <h3 className="font-extrabold text-lg text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Withdrawal History</span>
              </h3>

              {withdrawals.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl" id="withdrawals-empty">
                  <Gift className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No withdrawal records found.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Request your first payout as soon as you hit the $1.00 threshold!</p>
                </div>
              ) : (
                <div className="overflow-x-auto" id="withdrawals-history-table">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-2">Date</th>
                        <th className="pb-3 pr-2">Transaction ID</th>
                        <th className="pb-3 pr-2">Amount</th>
                        <th className="pb-3 pr-2">Method</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300 text-xs">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-950/20 transition">
                          <td className="py-3 pr-2 text-slate-400 font-mono">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-2 text-cyan-400 font-extrabold font-mono" title={w.payoutDetails}>
                            {w.transaction_id}
                          </td>
                          <td className="py-3 pr-2 font-bold text-white font-mono">
                            ${w.amount.toFixed(2)}
                          </td>
                          <td className="py-3 pr-2 font-bold">
                            {w.payoutMethod}
                          </td>
                          <td className="py-3 font-semibold">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              w.status === 'Approved' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800/50 pt-4 mt-6 text-slate-500 text-[10px] flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>UPI transfer is processed instantly. Crypto takes up to 2 hours depending on blockchain confirmation.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
