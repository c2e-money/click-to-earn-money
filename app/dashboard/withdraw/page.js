"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [data, setData] = useState({ walletBalance: 0, totalWithdrawn: 0, withdrawals: [], paymentMethod: "" });
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!wAmount || wAmount <= 0) return alert("Enter valid amount");
    if (wAmount > data.walletBalance) return alert("Insufficient balance!");
    if (!data.paymentMethod && !method) return alert("Please set a payment method first!");

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        walletBalance: increment(-wAmount),
        withdrawals: arrayUnion({
          amount: wAmount.toFixed(2),
          method: data.paymentMethod || method,
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

  const savePaymentMethod = async () => {
    if (!method) return;
    await updateDoc(doc(db, "users", user.uid), { paymentMethod: method });
    alert("Payment method saved!");
    fetchData(user.uid);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050608] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-purple-500">Withdraw Funds</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* Stats Grid */}
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

        {/* Payment Method Setup */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <p className="text-[10px] uppercase font-black text-gray-500 mb-2">Payment Details (UPI/Bank)</p>
          <div className="flex gap-2">
            <input 
                value={method} 
                onChange={(e) => setMethod(e.target.value)} 
                placeholder={data.paymentMethod || "Enter UPI ID or Bank Details"} 
                className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs font-bold outline-none" 
            />
            <button onClick={savePaymentMethod} className="bg-[#1f2937] px-4 rounded-xl text-[10px] font-black uppercase">Save</button>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount to Withdraw" 
            className="w-full bg-[#050608] p-4 rounded-xl border border-[#1f2937] mb-3 text-sm font-bold" 
          />
          <button 
            onClick={handleWithdraw} 
            disabled={loading}
            className="w-full bg-purple-600 p-4 rounded-xl font-black uppercase text-xs active:scale-95 transition-transform"
          >
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
                    <p className="text-[8px] text-gray-500 uppercase">{h.method}</p>
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
                                                  
