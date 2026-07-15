"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [data, setData] = useState({ walletBalance: 0, withdrawals: [], paymentMethod: null });
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) { setUser(u); fetchData(u.uid); }
    });
    return () => unsub();
  }, []);

  const fetchData = async (uid) => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) setData(docSnap.data());
  };

  const handleWithdraw = async () => {
    const wAmount = parseFloat(amount);
    if (!wAmount || wAmount < 5) return alert("Min $5");
    if (wAmount > data.walletBalance) return alert("Insufficient balance");

    setLoading(true);
    try {
      const withdrawId = "WD-" + Date.now().toString().slice(-6);
      await updateDoc(doc(db, "users", user.uid), {
        walletBalance: increment(-wAmount),
        withdrawals: arrayUnion({
          id: withdrawId,
          amount: wAmount.toFixed(2),
          method: data.paymentMethod?.method || "N/A",
          details: data.paymentMethod?.details || {},
          status: 'Pending',
          date: new Date().toISOString()
        })
      });
      alert("Requested ID: " + withdrawId);
      setAmount("");
      fetchData(user.uid);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white p-4 pb-24">
      <h1 className="text-purple-500 font-black uppercase mb-6">Withdraw Funds</h1>
      
      {/* Balance Card */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f2937] mb-6">
        <p className="text-[10px] text-gray-500 uppercase font-black">Available Balance</p>
        <p className="text-2xl font-black text-emerald-400">${(data.walletBalance || 0).toFixed(2)}</p>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f2937] mb-6">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (Min $5)" className="w-full bg-black p-3 rounded-lg mb-3 border border-[#1f2937] text-sm" />
        <button onClick={handleWithdraw} className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase text-xs">Request Payout</button>
      </div>

      {/* History (Optional chaining prevents blank screen) */}
      <h2 className="text-[10px] uppercase font-black text-gray-500 mb-2">History</h2>
      <div className="space-y-3">
        {data.withdrawals?.length > 0 ? (
          [...data.withdrawals].reverse().map((w, i) => (
            <div key={i} className="bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] flex justify-between items-center text-xs">
              <span>{w.id} (${w.amount})</span>
              <span className={w.status === 'Paid' ? 'text-emerald-500' : 'text-yellow-500'}>{w.status}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 text-xs mt-4">No withdrawals yet.</p>
        )}
      </div>
      <Navbar active="withdraw" />
    </div>
  );
    }
        
