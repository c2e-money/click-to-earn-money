"use client";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function LinksHistory() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      <header className="p-4 border-b border-[#1f2937] text-center"><h1 className="text-lg font-black italic uppercase">MY LINKS</h1></header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center"><p className="text-xs text-gray-500">No links generated yet.</p></div>
      </main>
      <nav className="bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-purple-400"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
}
