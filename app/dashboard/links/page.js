"use client";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function Links() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] text-center font-black uppercase">My Links</header>
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center text-gray-500 text-xs">No links yet.</div>
      </main>
      <nav className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-purple-400"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
}
