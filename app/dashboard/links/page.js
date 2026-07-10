"use client";
import { Home, Link2, Wallet, Settings } from "lucide-react";
import Link from "next/link";

export default function Links() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center">
          <p className="text-xs text-gray-500 font-bold uppercase">No links generated yet.</p>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-4 flex justify-around z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-600">
          <Home size={20} /><span className="text-[10px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-purple-500">
          <Link2 size={20} /><span className="text-[10px] font-black uppercase mt-1">Links</span>
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-600">
          <Wallet size={20} /><span className="text-[10px] font-black uppercase mt-1">Withdraw</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center text-gray-600">
          <Settings size={20} /><span className="text-[10px] font-black uppercase mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
        }
