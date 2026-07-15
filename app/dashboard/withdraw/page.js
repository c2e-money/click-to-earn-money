"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [data, setData] = useState({ walletBalance: 0, totalWithdrawn: 0, withdrawals: [], paymentMethod: null });
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Payment Form States
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");

  const methods = ["UPI", "Google Pay", "PhonePe", "PayPal", "Bank Transfer", "Google Play Redeem Code"];

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

  const savePayment = async () => {
    if (!method || !details) return alert("Select Method & Fill Details!");
    await updateDoc(doc(db, "users", user.uid), { paymentMethod: { method, details } });
    alert("Payment method saved!");
    fetchData(user.uid);
  };

  const handleWithdraw = async () => {
    const wAmount = parseFloat(amount);
    if (!wAmount || wAmount <= 0) return alert("Enter valid amount");
    if (wAmount > data.walletBalance) return alert("Insufficient balance!");
    if (!data.paymentMethod) return alert("Setup payment method first!");

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        walletBalance: increment(-wAmount),
        withdrawals: arrayUnion({
          amount: wAmount.toFixed(2),
          method: data.paymentMethod.method,
          details: data.paymentMethod.details,
          status: 'Pending',
          date: new Date().toISOString()
        })
      });
      alert("Withdrawal request sent!");
      setAmount("");
      fetchData(user.uid);
    } catch (error) { alert("Error: " + error.message); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050608] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-purple-500">Withdraw Funds</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
                <p className="text-[8px] uppercase font-black text-emerald-500">Available</p>
                <h2 className="text-lg font-black">${(data.walletBalance || 0).toFixed(2)}</h2>
            </div>
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
                <p className="text-[8px] uppercase font-black text-gray-500">Total Withdrawn</p>
                <h2 className="text-lg font-black">${(data.totalWithdrawn || 0).toFixed(2)}</h2>
            </div>
        </div>

        {/* Payment Setup */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <h3 className="text-[10px] font-black uppercase text-gray-500 mb-3">Setup Payment</h3>
          {data.paymentMethod ? (
            <div className="bg-[#1f2937] p-3 rounded-xl mb-3">
              <p className="text-[10px] font-bold text-emerald-400">{data.paymentMethod.method}</p>
              <p className="text-xs text-white truncate">{data.paymentMethod.details}</p>
              <button onClick={() => updateDoc(doc(db, "users", user.uid), { paymentMethod: null }).then(fetchData)} className="text-[8px] text-red-500 underline mt-1">Change Method</button>
            </div>
          ) : (
            <div className="space-y-2">
              <select onChange={(e) => setMethod(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs font-bold outline-none">
                <option value="">Select Method</option>
                {methods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <input onChange={(e) => setDetails(e.target.value)} placeholder="Enter details (UPI ID, A/c No, etc.)" className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs font-bold outline-none" />
              <button onClick={savePayment} className="w-full bg-[#1f2937] py-2 rounded-xl text-[10px] font-black uppercase">Save Method</button>
            </div>
          )}
        </div>

        {/* Withdraw Form */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount to Withdraw" className="w-full bg-[#050608] p-4 rounded-xl border border-[#1f2937] mb-3 text-sm font-bold" />
          <button onClick={handleWithdraw} disabled={loading} className="w-full bg-purple-600 p-4 rounded-xl font-black uppercase text-xs active:scale-95 transition-transform">
            {loading ? "Processing..." : "Request Payout"}
          </button>
        </div>

        {/* History */}
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-500 mb-3">Transaction History</h3>
          <div className="space-y-3">
            {!data.withdrawals || data.withdrawals.length === 0 ? (
              <p className="text-center text-gray-600 text-xs italic font-bold">No history.</p>
            ) : (
              [...data.withdrawals].reverse().map((h, index) => (
                <div key={index} className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black text-white">${h.amount}</p>
                    <p className="text-[8px] text-gray-500 uppercase">{h.method} • {h.details}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${h.status === 'Paid' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {h.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
          }
  
