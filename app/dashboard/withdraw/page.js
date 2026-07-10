"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [method, setMethod] = useState("phonepe");
  const [history, setHistory] = useState([]);

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
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <select onChange={(e) => setMethod(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm">
            <option value="phonepe">PhonePe</option>
            <option value="anyupi">Any UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
          {method === "bank" ? (
             <div className="space-y-2 mb-3"><input placeholder="Holder Name" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm"/><input placeholder="Account No" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm"/><input placeholder="IFSC" className="w-full bg-[#0b0e14] p-3 rounded border border-[#1f2937] text-sm"/></div>
          ) : (
            <input placeholder="Enter ID/Number" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm"/>
          )}
          <button className="w-full bg-emerald-600 p-3 rounded-xl font-black text-xs uppercase">Withdraw Now</button>
        </div>
        {history.map(h => <div key={h.id} className="bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs">{h.amount} - {h.status}</div>)}
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
