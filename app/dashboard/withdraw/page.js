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
    if (!wAmount || wAmount < 5) return alert("Minimum withdrawal is $5.00");
    if (wAmount > data.walletBalance) return alert("Insufficient balance!");

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
      alert("Withdrawal request sent! ID: " + withdrawId);
      setAmount("");
      fetchData(user.uid);
    } catch (error) { alert("Error: " + error.message); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050608] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-purple-500">Withdraw Funds</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f2937]">
            <p className="text-[10px] text-gray-500 uppercase font-black">Available Balance</p>
            <p className="text-2xl font-black text-emerald-400">${(data.walletBalance || 0).toFixed(2)}</p>
        </div>

        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (Min $5)" className="w-full bg-[#050608] p-4 rounded-xl border border-[#1f2937] mb-3 text-sm font-bold" />
          <button onClick={handleWithdraw} disabled={loading} className="w-full bg-purple-600 p-4 rounded-xl font-black uppercase text-xs">
            {loading ? "Processing..." : "Request Payout"}
          </button>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-500 mb-3">Transaction History</h3>
          <div className="space-y-3">
            {data.withdrawals?.length > 0 ? (
              [...data.withdrawals].reverse().map((h, index) => (
                <div key={index} className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-black">${h.amount} ({h.id})</p>
                    <p className="text-[9px] text-gray-400">{h.method}</p>
                  </div>
                  <span className={`font-black uppercase ${h.status === 'Paid' ? 'text-emerald-500' : 'text-yellow-500'}`}>{h.status}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-xs italic font-bold">No history available.</p>
            )}
          </div>
        </div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
  }
              
