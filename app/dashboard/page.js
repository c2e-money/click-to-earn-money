"use client";
import { useState } from "react";
import { Home, Link2, Wallet, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleGenerate = () => {
    setShortUrl("click.to/isagi-bundle");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <input type="text" placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-sm mb-3 outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 py-3 rounded-lg font-black text-xs uppercase">Generate Link</button>

          {shortUrl && (
            <div className="mt-4 bg-[#0b0e14] p-3 rounded-xl border border-purple-500/30 flex justify-between items-center">
              <span className="text-xs font-bold text-purple-400 truncate mr-2">{shortUrl}</span>
              <button onClick={handleCopy} className="bg-purple-600 px-3 py-1.5 rounded-lg">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#131722] p-5 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-4">Traffic Analytics</h2>
          <div className="flex items-end justify-between h-20 gap-2">
            {[30, 60, 100, 70, 40, 90].map((h, i) => (
              <div key={i} style={{ height: `${h}%` }} className="w-1/6 bg-purple-600/50 rounded-t-lg"></div>
            ))}
          </div>
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
              
