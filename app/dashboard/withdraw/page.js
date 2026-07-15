"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [data, setData] = useState({ walletBalance: 0, withdrawals: [] });
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchData(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchData = async (uid) => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      setData(docSnap.data());
    }
  };

  const handleWithdraw = async () => {
    const wAmount = parseFloat(amount);
    if (!wAmount || wAmount <= 0) return alert("Enter valid amount");
    if (wAmount > data.walletBalance) return alert("Insufficient wallet balance!");
    if (wAmount < 1) return alert("Minimum withdrawal is $1.00");

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      // NAYA LOGIC: Wallet se minus, Total mein Plus
      await updateDoc(userRef, {
        walletBalance: increment(-wAmount),
        totalWithdrawn: increment(wAmount),
        withdrawals: arrayUnion({
          amount: wAmount.toFixed(2),
          status: 'Pending',
          date: new Date().toISOString()
        })
      });
      alert(`Successfully requested $${wAmount.toFixed(2)}`);
      setAmount("");
      fetchData(user.uid); // Refresh data
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-purple-500">Withdraw Funds</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Request Form */}
        <div className="bg-[#131722] p-5 rounded-3xl border border-[#1f2937]">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Available Balance</p>
          <h2 className="text-3xl font-black text-emerald-400 mb-4">${(data.walletBalance || 0).toFixed(2)}</h2>
          
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter Amount (Min $1)" 
            className="w-full bg-[#050608] p-4 rounded-xl border border-[#1f2937] outline-none focus:border-purple-500 text-sm font-bold mb-3" 
          />
          <button 
            onClick={handleWithdraw} 
            disabled={loading}
            className={`w-full bg-purple-600 p-4 rounded-xl font-black uppercase text-xs ${loading ? 'opacity-50' : 'active:scale-95 transition-transform'}`}
          >
            {loading ? "Processing..." : "Withdraw Now"}
          </button>
        </div>

        {/* History */}
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-500 mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            {!data.withdrawals || data.withdrawals.length === 0 ? (
              <p className="text-center text-gray-600 text-xs italic font-bold">No withdrawal history yet.</p>
            ) : (
              [...data.withdrawals].reverse().map((h, index) => (
                <div key={index} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
                  <div>
                    <span className="font-black text-sm text-white">${h.amount}</span>
                    <p className="text-[8px] text-gray-500 uppercase">{new Date(h.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${h.status === 'Paid' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {h.status || 'Pending'}
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
