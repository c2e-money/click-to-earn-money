import React, { useState, useEffect } from "react";
import { 
  DollarSign, ArrowDownToLine, Filter, AlertTriangle, 
  CheckCircle, Clock, XCircle, CreditCard, Send, Search
} from "lucide-react";
import { 
  listenToUserWithdrawals, 
  createWithdrawalRequest, 
  listenToUserProfile,
  saveUserPaymentDetails
} from "../lib/firebaseService";
import { Withdrawal, User } from "../types";

interface WithdrawalsTabProps {
  userUid: string;
}

export default function WithdrawalsTab({ userUid }: WithdrawalsTabProps) {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  // Form state
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"gpay" | "phonepe">("gpay");
  
  // Payment dynamic fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync user profile for real-time balance and auto-add payment details
  useEffect(() => {
    const unsubscribe = listenToUserProfile(userUid, (profile) => {
      setUserProfile(profile);
      if (profile && !isInitialized) {
        if (profile.paymentMethod) {
          setPaymentMethod(profile.paymentMethod);
        }
        if (profile.paymentMobileNumber) {
          setMobileNumber(profile.paymentMobileNumber);
        }
        setIsInitialized(true);
      }
    });
    return () => unsubscribe();
  }, [userUid, isInitialized]);

  // Handle manual saving of payment details
  const handleSavePaymentDetails = async () => {
    if (!mobileNumber || mobileNumber.trim().length < 10) {
      setError(`Please enter a valid 10-digit registered ${paymentMethod === "gpay" ? "Google Pay" : "PhonePe"} mobile number.`);
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await saveUserPaymentDetails(userUid, paymentMethod, mobileNumber.trim());
      setSuccessMessage("Default payment profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save payment profile.");
    } finally {
      setLoading(false);
    }
  };

  // Sync withdrawals list
  useEffect(() => {
    const unsubscribe = listenToUserWithdrawals(userUid, (list) => {
      setWithdrawals(list);
    });
    return () => unsubscribe();
  }, [userUid]);

  // Handle Withdrawal Submit
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please specify a valid withdrawal amount.");
      return;
    }

    if (!userProfile || userProfile.balance < parsedAmount) {
      setError("Insufficient available ledger balance.");
      return;
    }

    // Minimum withdrawal check for realism
    if (parsedAmount < 2.00) {
      setError("Minimum withdrawal amount is $2.00.");
      return;
    }

    // Prepare payment details based on method
    if (!mobileNumber || mobileNumber.trim().length < 10) {
      setError(`Please enter a valid 10-digit registered ${paymentMethod === "gpay" ? "Google Pay" : "PhonePe"} mobile number.`);
      return;
    }
    
    let paymentDetails = { mobileNumber: mobileNumber.trim() };

    setLoading(true);
    try {
      await createWithdrawalRequest(userUid, parsedAmount, paymentMethod, paymentDetails);
      setSuccessMessage(`Withdrawal of $${parsedAmount.toFixed(2)} requested successfully!`);
      // Reset form
      setAmount("");
      setMobileNumber("");
    } catch (err: any) {
      setError(err.message || "Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter === "all") return true;
    return w.status === filter;
  });

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12 px-4" id="withdraw-tab-viewport">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Ledger Payouts</span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Withdraw Funds</h1>
        </div>
        <div className="px-3 py-1.5 bg-[#131a2e] border border-slate-800 rounded-2xl text-[10px] text-slate-400 font-bold select-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          Secured Gateway
        </div>
      </div>

      {/* 2. Available Balance Card */}
      <div className="bg-[#0b0f19] border border-amber-500/15 rounded-2xl p-4 glow-amber relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-6 -mt-6" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Available Balance</span>
          <DollarSign className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-white font-mono">
            ${userProfile?.balance?.toFixed(4) || "0.0000"}
          </span>
          <p className="text-[9px] text-slate-400 mt-1">
            Minimum withdrawal: <span className="text-amber-500 font-bold">$2.00 USD</span>
          </p>
        </div>
      </div>

      {/* 3. Request Form */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <ArrowDownToLine className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-tight">Create Payout Request</h2>
        </div>

        <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
          
          {/* Amount field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount to Withdraw ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                min="2.00"
                placeholder="2.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 transition-all font-mono font-bold"
                id="withdraw-amount-input"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Gateway</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
              id="payment-method-select"
            >
              <option value="gpay">Google Pay (GPay)</option>
              <option value="phonepe">PhonePe</option>
            </select>
          </div>

          {/* Dynamic Inputs Render */}
          <div className="border-t border-slate-800/60 pt-3.5 space-y-3">
            {paymentMethod === "gpay" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered Google Pay Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-digit GPay Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 transition-all font-mono"
                  id="payment-gpay-input"
                />
              </div>
            )}

            {paymentMethod === "phonepe" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered PhonePe Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-digit PhonePe Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#131a2e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600 transition-all font-mono"
                  id="payment-phonepe-input"
                />
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSavePaymentDetails}
                disabled={loading || mobileNumber.trim().length < 10}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-extrabold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none focus:outline-none cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" /> Save to Account
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-xl text-xs flex gap-2 select-none">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 rounded-xl text-xs flex gap-2 select-none">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-xs font-extrabold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/15 transition-all cursor-pointer disabled:opacity-50"
            id="withdraw-submit-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing request...
              </>
            ) : (
              <>
                SUBMIT WITHDRAW REQUEST
                <Send className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>

      {/* 4. TRANSACTION HISTORY FILTERS */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-850 border border-slate-800 text-slate-400 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-tight font-display">Receipts history</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500">{withdrawals.length} entries</span>
        </div>

        {/* Status Filters */}
        <div className="flex gap-1 bg-[#131a2e] p-0.5 rounded-lg border border-slate-800/80">
          {(["all", "pending", "approved", "rejected"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-extrabold rounded-md transition-all ${
                filter === st 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/15" 
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* List render */}
        {filteredWithdrawals.length === 0 ? (
          <div className="py-8 text-center select-none text-slate-600 text-xs">
            No withdrawal records matching this status.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {filteredWithdrawals.map((w) => (
              <div 
                key={w.id} 
                className="bg-[#131a2e] border border-slate-800/80 rounded-xl p-3 space-y-2.5 hover:border-slate-700 transition-all"
              >
                {/* ID & Status Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-slate-400">{w.id.toUpperCase()}</span>
                    <span className="text-[9px] text-slate-500 ml-2">
                      {new Date(w.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  
                  {/* Status Badges */}
                  {w.status === "pending" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-extrabold uppercase rounded-full">
                      <Clock className="w-2.5 h-2.5 animate-spin" />
                      Pending
                    </span>
                  )}
                  {w.status === "approved" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-extrabold uppercase rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Paid
                    </span>
                  )}
                  {w.status === "rejected" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-extrabold uppercase rounded-full">
                      <XCircle className="w-2.5 h-2.5" />
                      Rejected
                    </span>
                  )}
                </div>

                {/* Amount and gateway detail */}
                <div className="flex justify-between items-center text-xs font-bold bg-[#0b0f19] p-2 rounded-lg border border-slate-800/50">
                  <span className="text-white font-mono">${w.amount.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{w.paymentMethod} Gateway</span>
                </div>

                {/* Payment proof / details / rejection warning */}
                <div className="text-[9px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Target Address:</span>
                    <span className="font-mono text-slate-300">
                      {w.paymentDetails?.mobileNumber || "N/A"}
                    </span>
                  </div>

                  {w.status === "approved" && w.referenceId && (
                    <div className="flex justify-between border-t border-slate-800/40 pt-1 text-emerald-500/80">
                      <span>Ref Proof (UTR/Txn):</span>
                      <span className="font-mono font-bold text-slate-300">{w.referenceId}</span>
                    </div>
                  )}

                  {w.status === "rejected" && w.rejectionReason && (
                    <div className="mt-2.5 p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-rose-400/90 leading-relaxed flex gap-1.5 select-none text-[9px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase block text-[8px] text-rose-500 mb-0.5">Rejection warning:</span>
                        {w.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
