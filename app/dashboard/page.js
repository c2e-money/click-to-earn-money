"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [url, setUrl] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    const saved = JSON.parse(localStorage.getItem("myLinks") || "[]");
    const newLink = { id: Date.now(), url: url, alias: "c2e.com/" + Date.now().toString().slice(-4), clicks: 0 };
    localStorage.setItem("myLinks", JSON.stringify([newLink, ...saved]));
    alert("Link Generated!");
    setUrl("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] font-bold text-gray-500 uppercase">Total Clicks</p>
            <p className="text-lg font-black text-white">0</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] font-bold text-gray-500 uppercase">Total Withdrawal</p>
            <p className="text-lg font-black text-emerald-400">$0.00</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] font-bold text-gray-500 uppercase">Current CPM</p>
            <p className="text-lg font-black text-white">$0.00</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] font-bold text-gray-500 uppercase">Total Earnings</p>
            <p className="text-lg font-black text-purple-500">$0.00</p>
          </div>
        </div>

        {/* Analysis/Graph Section */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-4">Traffic Analysis</p>
          <div className="h-32 flex items-end gap-2">
            {/* Visual bars representation */}
            {[40, 70, 45, 90, 60, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-[#1f2937] rounded-t-lg relative group">
                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-purple-600 rounded-t-lg transition-all"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Generate */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="Paste URL..." 
            className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm" 
          />
          <button 
            onClick={handleGenerate} 
            className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase"
          >
            Generate Link
          </button>
        </div>
      </main>

      <Navbar active="home" />
    </div>
  );
              }
