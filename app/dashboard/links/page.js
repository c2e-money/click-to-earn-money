"use client";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function LinksHistory() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      {/* Humara Custom Header */}
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-lg font-black italic uppercase">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center">
          <p className="text-xs text-gray-500 font-bold">No links generated yet.</p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
            <Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-purple-400">
            <Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span>
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500">
            <Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span>
        </Link>
      </nav>
    </div>
  );
}
