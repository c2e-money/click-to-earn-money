"use client";
import { useState } from "react";
import { Home, Link2, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [clicks, setClicks] = useState(150); // Example state for dynamic graph

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
            <p className="text-lg font-black text-emerald-400">$0.00</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">CPM</p>
            <p className="text-lg font-black text-purple-400">$2.50</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Total Clicks</p>
            <p className="text-lg font-black text-white">{clicks}</p>
          </div>
          <div className="bg-[#131722] p-3 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase">Total Withdrawal</p>
            <p className="text-lg font-black text-white">$0.00</p>
          </div>
        </div>

        {/* Shortener */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[9px] font-black uppercase mb-3 text-gray-400">Shorten New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none focus:border-purple-500" />
          <input type="text" placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none focus:border-purple-500" />
          <button className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase hover:bg-purple-700">Generate Link</button>
        </div>

        {/* Graph Area (Sabse niche) */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
            <TrendingUp size={12}/> Traffic Analysis
          </p>
          <div className="h-28 flex items-end gap-2 px-1">
            <div className="w-full h-1/3 bg-purple-700/50 rounded-t"></div>
            <div className="w-full h-1/2 bg-purple-600 rounded-t"></div>
            <div className="w-full h-3/4 bg-purple-500 rounded-t"></div>
            <div className="w-full h-full bg-purple-400 rounded-t shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
            <div className="w-full h-2/3 bg-purple-600 rounded-t"></div>
          </div>
        </div>
      </main>

      {/* Navbar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-4 flex justify-around z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-purple-500">
          <Home size={20} /><span className="text-[10px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-600">
          <Link2 size={20} /><span className="text-[10px] font-black uppercase mt-1">Links</span>
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-600">
          <Wallet size={20} /><span className="text-[10px] font-black uppercase mt-1">Withdraw</span>
        </Link>
      </nav>
    </div>
  );
          }
