"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, addDoc, collection } from "firebase/firestore";

export default function WithdrawPage() {
  const [userData, setUserData] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    };
    fetchUser();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 2.00) return alert("Minimum withdrawal is $2.00");
    if (amount > userData.walletBalance) return alert("Insufficient Balance!");

    setLoading(true);
    try {
      // 1. Cut from wallet
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        walletBalance: increment(-amount),
        pendingAmount: increment(amount) // Optional: create this field in DB if needed
      });
      // 2. Add to transaction history
      await addDoc(collection(db, "withdrawals"), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        amount: amount,
        status: "Pending",
        date: new Date()
      });
      alert("Withdrawal Requested Successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error processing withdrawal.");
    }
    setLoading(false);
  };

  if (!userData) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-white mb-6">Withdraw Funds</h2>

      {/* Rules Notice Board */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 shadow-lg">
        <h3 className="text-emerald-400 font-black text-sm flex items-center gap-2 mb-4">
          <span>📢</span> Important Notice
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <p className="font-bold text-white mb-1">💱 Fixed Exchange Rate</p>
            <p className="text-neutral-500 text-xs">$1 is equivalent to ₹83.</p>
          </div>
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <p className="font-bold text-white mb-1">⚡ Instant Withdrawals</p>
            <p className="text-neutral-500 text-xs">Experience lightning-fast payouts directly to your account.</p>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2 bg-gradient-to-r from-emerald-900/40 to-neutral-900 border border-emerald-900/50 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-emerald-500 text-xs font-black tracking-wider uppercase mb-1">Available Balance</p>
            <p className="text-3xl font-black text-white">${userData.walletBalance?.toFixed(4) || "0.0000"}</p>
            <p className="text-neutral-400 text-xs mt-1">Min limit: <span className="text-white font-bold">$2.00</span></p>
          </div>
          <div className="bg-emerald-500/20 p-4 rounded-full">💰</div>
        </div>
      </div>

      {/* Request Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6">
        <h3 className="text-white font-black text-sm mb-4">📤 Request Payment</h3>
        <form onSubmit={handleWithdraw}>
          <div className="relative mb-4">
            <span className="absolute left-4 top-3.5 text-neutral-400 font-black">$</span>
            <input 
              type="number" 
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition font-bold"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-4 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Request Withdraw ➔"}
          </button>
        </form>
      </div>
    </div>
  );
}
