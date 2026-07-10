
"use client";
import { useState, useEffect } from "react";
import { Home, Link2, Wallet, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Pre-rendering error ko rokne ke liye

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-lg font-black italic uppercase">CLICK TO EARN</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-br from-[#1a1c29] to-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Available Balance</p>
          <p className="text-4xl font-black text-emerald-400 mt-1">$0.00</p>
        </div>

        <div className="bg-[#131722] p-5 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-3">Shorten New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-sm mb-2 outline-none" />
          <button className="w-full bg-purple-600 py-3 rounded-lg font-black text-xs uppercase">Generate Link</button>
        </div>
      </main>

      <nav className="bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-purple-400">
          <Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-500">
          <Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span>
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500">
          <Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span>
        </Link>
      </nav>
    </div>
  );
}
