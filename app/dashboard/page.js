"use client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  // Stats default 0 hain, jab real data aayega tabhi update hoga
  const [stats] = useState({
    balance: 0,
    cpm: 2.50,
    clicks: 0,
    withdraw: 0
  });

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">C2E DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Balance</p>
            <p className="text-lg font-black text-emerald-400">${stats.balance.toFixed(2)}</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">CPM</p>
            <p className="text-lg font-black text-purple-400">${stats.cpm.toFixed(2)}</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Total Clicks</p>
            <p className="text-lg font-black text-white">{stats.clicks}</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Total Withdrawal</p>
            <p className="text-lg font-black text-white">${stats.withdraw.toFixed(2)}</p>
          </div>
        </div>

        {/* Shortener */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[9px] font-black uppercase mb-3 text-gray-400">Shorten New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <input type="text" placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <button className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>

        {/* Graph Area */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
            <TrendingUp size={12}/> Traffic Analysis
          </p>
          {stats.clicks === 0 ? (
            <div className="h-28 flex items-center justify-center border-dashed border-2 border-[#1f2937] rounded-xl text-[10px] text-gray-600 font-bold uppercase">
              Waiting for real clicks...
            </div>
          ) : (
            <div className="h-28 flex items-end gap-2 px-1">
              {/* Graph bars yahan aayengi jab clicks > 0 honge */}
              <div className="w-full h-1/2 bg-purple-500 rounded-t"></div>
            </div>
          )}
        </div>
      </main>

      {/* Navbar Integration */}
      <Navbar active="home" />
    </div>
  );
}
