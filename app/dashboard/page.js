"use client";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-[#1f2937]">
        <h1 className="text-xl font-black italic uppercase">CLICK TO EARN</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Balance & CPM */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-400 font-bold uppercase">Balance</p>
            <p className="text-2xl font-black text-emerald-400">$0.00</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-400 font-bold uppercase">CPM</p>
            <p className="text-2xl font-black text-purple-400">$2.50</p>
          </div>
        </div>

        {/* Clicks & Withdraw Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase">Total Clicks</p>
            <p className="text-xl font-black text-white">0</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase">Withdrawal</p>
            <p className="text-xl font-black text-white">$0.00</p>
          </div>
        </div>

        {/* Shortener */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-3">Shorten New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] border border-[#1f2937] p-2.5 rounded-lg text-sm mb-2 outline-none" />
          <button className="w-full bg-purple-600 py-3 rounded-lg font-black text-xs uppercase">Generate Link</button>
        </div>
      </main>

      {/* Stable Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around z-[100]">
        <Link href="/dashboard" className="flex flex-col items-center text-purple-400"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-500"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
        }
        
