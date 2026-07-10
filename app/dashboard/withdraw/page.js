"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // Apni firebase config file ka path check kar lena
import { doc, getDoc, collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Wallet, Home, Link2 } from "lucide-react";
import Link from "next/link";

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [method, setMethod] = useState("UPI");
  const [details, setDetails] = useState("");
  const [history, setHistory] = useState([]);

  // Fetch Balance & History
  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Balance fetch
    const userRef = doc(db, "users", auth.currentUser.uid);
    getDoc(userRef).then(doc => doc.exists() && setBalance(doc.data().balance));

    // History fetch (Realtime)
    const q = query(collection(db, "withdrawals"), where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Submit Request
  const handleWithdraw = async () => {
    if (balance < 1) return alert("Minimum balance required is $1");
    await addDoc(collection(db, "withdrawals"), {
      userId: auth.currentUser.uid,
      method,
      details,
      status: "PENDING",
      amount: balance,
      createdAt: new Date().toISOString()
    });
    alert("Withdrawal Requested!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-lg font-black italic uppercase">WITHDRAW</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-gradient-to-br from-[#1a1c29] to-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Available Balance</p>
          <p className="text-4xl font-black text-emerald-400 mt-2">${balance.toFixed(2)}</p>
        </div>

        <div className="bg-[#131722] p-5 rounded-2xl border border-[#1f2937]">
          <select onChange={(e) => setMethod(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-sm mb-3 outline-none font-bold">
            <option value="UPI">UPI</option>
            <option value="PhonePe">PhonePe</option>
            <option value="Local Bank">Local Bank</option>
            <option value="bKash">bKash</option>
            <option value="PayPal">PayPal</option>
          </select>
          <input onChange={(e) => setDetails(e.target.value)} type="text" placeholder={`Enter ${method} details...`} className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-sm mb-3 outline-none" />
          <button onClick={handleWithdraw} className="w-full bg-purple-600 py-3 rounded-lg font-black text-xs uppercase">Submit Request</button>
        </div>

        <div>
          <h2 className="text-[10px] font-black uppercase mb-3 text-gray-500">Live Status</h2>
          {history.map((h) => (
            <div key={h.id} className="bg-[#131722] p-4 mb-3 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div>
                <p className="text-[10px] text-purple-400 font-black">#{h.id.slice(0, 8)}</p>
                <p className="text-xs font-bold">{h.method}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded ${h.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{h.status}</span>
            </div>
          ))}
        </div>
      </main>

      <nav className="bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500"><Home size={20} /><span className="text-[9px] uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-500"><Link2 size={20} /><span className="text-[9px] uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-purple-400"><Wallet size={20} /><span className="text-[9px] uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
}
