"use client";
import { useState } from "react";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo bhai!");
    console.log("Generating with Alias:", alias || "Auto-Generated");
    alert("Link Generated: " + (alias || "lg.ink/xyz"));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-[#1f2937]">
        <h1 className="text-xl font-black italic uppercase">CLICK TO EARN</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Stats Grid */}
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

        {/* Shortener */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-3">Shorten New Link</h2>
          <input 
            value={url} onChange={(e) => setUrl(e.target.value)}
            type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] border border-[#1f2937] p-2.5 rounded-lg text-sm mb-2 outline-none" />
          <input 
            value={alias} onChange={(e) => setAlias(e.target.value)}
            type="text" placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] border border-[#1f2937] p-2.5 rounded-lg text-sm mb-3 outline-none" />
          <button 
            onClick={handleGenerate}
            className="w-full bg-purple-600 py-3 rounded-lg font-black text-xs uppercase">Generate Link</button>
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
