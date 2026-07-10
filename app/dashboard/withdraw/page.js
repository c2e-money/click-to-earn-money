"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [method, setMethod] = useState("phonepe");
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("withdrawHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">WITHDRAW FUNDS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] text-gray-500 font-bold uppercase">Available Balance</p>
          <p className="text-3xl font-black text-emerald-400 mb-6">$0.00</p>
          
          <select onChange={(e) => setMethod(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none">
            <option value="phonepe">PhonePe</option>
            <option value="anyupi">Any UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
          
          {method === "bank" ? (
             <div className="space-y-2 mb-3">
               <input placeholder="Holder Name" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm outline-none"/>
               <input placeholder="Account No" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm outline-none"/>
               <input placeholder="IFSC" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm outline-none"/>
             </div>
          ) : (
            <input placeholder="Enter ID/Number" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none"/>
          )}
          <button className="w-full bg-emerald-600 p-3 rounded-xl font-black text-xs uppercase">Withdraw Now</button>
        </div>

        {/* History Section: Sirf tabhi dikhega jab history mein data hoga */}
        {history.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-gray-500">Withdrawal History</p>
            {history.map(h => (
              <div key={h.id} className="bg-[#131722] p-4 rounded-xl border border-[#1f2937] flex justify-between items-center text-xs">
                <div><p className="font-bold">{h.amount}</p><p className="text-gray-400">{h.method}</p></div>
                <span className="font-black text-emerald-500">{h.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
