"use client";
import { useState } from "react";
import { Home, Link2, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [clicks, setClicks] = useState(150); // Example Clicks
  const [balance, setBalance] = useState(5.40);
  
  // Graph Logic: 0 to 500 clicks ke hisaab se bar height
  const graphHeight = Math.min((clicks / 500) * 100, 100);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white overflow-hidden">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center">
        <h1 className="text-xl font-black italic uppercase">LG DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-400 font-bold uppercase">Balance</p>
            <p className="text-xl font-black text-emerald-400">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-400 font-bold uppercase">Total Clicks</p>
            <p className="text-xl font-black text-white">{clicks}</p>
          </div>
        </div>

        {/* Dynamic Graph Section */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase text-gray-400">Click Traffic</p>
                <TrendingUp size={16} className="text-purple-500" />
            </div>
            <div className="h-24 flex items-end gap-2">
                <div style={{ height: `${graphHeight}%` }} className="w-full bg-purple-600 rounded-t-lg transition-all duration-500"></div>
            </div>
        </div>

        {/* Withdrawal Stats */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase">Total Withdrawal</p>
            <p className="text-lg font-black text-white">$0.00</p>
        </div>

        {/* Shortener */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-3">Shorten New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] border border-[#1f2937] p-2 rounded-lg text-sm mb-2 outline-none" />
          <button className="w-full bg-purple-600 py-2.5 rounded-lg font-black text-xs uppercase">Generate</button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around z-[100]">
        <Link href="/dashboard" className="flex flex-col items-center text-purple-400"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-500"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
          }
          
