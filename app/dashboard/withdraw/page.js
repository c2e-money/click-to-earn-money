"use client";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function Withdraw() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] text-center font-black uppercase">Withdraw Funds</header>
      <main className="flex-1 overflow-y-auto p-4">
        {/* Withdraw Content */}
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center">
            <p className="text-gray-400 text-sm">No withdrawal history yet.</p>
        </div>
      </main>
      
      {/* Fixed Navbar (Ye ab kabhi jump nahi karega) */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around z-[100]">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-500"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-purple-400"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
      </nav>
    </div>
  );
}
