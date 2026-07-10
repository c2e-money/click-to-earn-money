"use client";
import { useState } from "react";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-xl font-black italic uppercase">CLICK TO EARN</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <p className="text-sm font-bold">Dashboard content active hai.</p>
        </div>
      </main>
    </div>
  );
}
