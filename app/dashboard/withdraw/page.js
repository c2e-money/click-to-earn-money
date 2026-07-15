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
  
  // Form States
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

  const savePayment = async () => {
    if (!method || Object.keys(details).length === 0) return alert("Fill all details!");
    await updateDoc(doc(db, "users", user.uid), { paymentMethod: { method, details } });
    alert("Payment details saved!");
    fetchData(user.uid);
  };

  const handleWithdraw = async () => {
    const wAmount = parseFloat(amount);
    if (!wAmount || wAmount < 5) return alert("Minimum withdrawal is $5.00");
    if (wAmount > data.walletBalance) return alert("Insufficient balance!");

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
        
        {/* Stats */}
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

        {/* Dynamic Payment Setup */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <h3 className="text-[10px] font-black uppercase text-gray-500 mb-3">Setup Payment Method</h3>
          {data.paymentMethod ? (
            <div className="bg-[#1f2937] p-3 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-400">{data.paymentMethod.method}</p>
              <pre className="text-xs text-white mt-1 font-mono">{JSON.stringify(data.paymentMethod.details, null, 2)}</pre>
              <button onClick={() => updateDoc(doc(db, "users", user.uid), { paymentMethod: null }).then(fetchData)} className="text-[8px] text-red-500 underline mt-2">Change</button>
            </div>
          ) : (
            <div className="space-y-3">
              <select onChange={(e) => { setMethod(e.target.value); setDetails({}); }} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs font-bold outline-none">
                <option value="">Select Method</option>
                <option value="UPI">UPI (GooglePay/PhonePe/Paytm)</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Redeem Code">Google Play Redeem Code</option>
              </select>

              {method === "UPI" && <input placeholder="Enter UPI ID" onChange={(e) => setDetails({ upiId: e.target.value })} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />}
              {method === "PayPal" && <input placeholder="Enter PayPal Email" onChange={(e) => setDetails({ email: e.target.value })} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />}
              {method === "Bank Transfer" && (
                <div className="space-y-2">
                  <input placeholder="Account Holder Name" onChange={(e) => setDetails(prev => ({...prev, name: e.target.value}))} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />
                  <input placeholder="Account Number" onChange={(e) => setDetails(prev => ({...prev, acc: e.target.value}))} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />
                  <input placeholder="IFSC Code" onChange={(e) => setDetails(prev => ({...prev, ifsc: e.target.value}))} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />
                </div>
              )}
              {method === "Redeem Code" && <input placeholder="Email for Redeem Code" onChange={(e) => setDetails({ email: e.target.value })} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937] text-xs" />}
              
              <button onClick={savePayment} className="w-full bg-purple-600 py-3 rounded-xl text-[10px] font-black uppercase">Save Method</button>
            </div>
          )}
        </div>

        {/* Withdraw */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (Min $5)" className="w-full bg-[#050608] p-4 rounded-xl border border-[#1f2937] mb-3 text-sm font-bold" />
          <button onClick={handleWithdraw} disabled={loading} className="w-full bg-emerald-600 p-4 rounded-xl font-black uppercase text-xs active:scale-95 transition-transform">
            {loading ? "Processing..." : "Withdraw Now"}
          </button>
        </div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
               }
                                                                             
