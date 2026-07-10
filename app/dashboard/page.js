"use client";
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("HOME");

  return (
    <div className="bg-[#050608] text-white min-h-screen font-sans pb-24">
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
        <div className="w-9 h-9 flex items-center justify-center bg-purple-600 rounded-full border border-purple-400 font-black text-[10px]">C2E</div>
      </header>

      <main className="p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] text-gray-500 uppercase font-black">Clicks</p>
            <h2 className="text-lg font-black">0</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] text-gray-500 uppercase font-black">Withdrawal</p>
            <h2 className="text-lg font-black">$0.00</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] text-gray-500 uppercase font-black">CPM</p>
            <h2 className="text-lg font-black">$0.00</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] text-gray-500 uppercase font-black">Earnings</p>
            <h2 className="text-lg font-black text-emerald-400 italic">$0.00</h2>
          </div>
        </div>

        {/* Generator */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs outline-none" placeholder="Paste URL..." />
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs outline-none" placeholder="Custom Alias (Optional)" />
          <button className="w-full bg-purple-600 py-3 rounded-xl font-black uppercase text-[11px] active:scale-95 transition-transform">Generate Link</button>
        </div>

        {/* Traffic Analysis */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mt-6">
          <h2 className="text-[10px] font-black uppercase mb-4 italic text-gray-500">Traffic Analysis</h2>
          <div className="text-center text-[10px] text-gray-700 py-4 italic">No traffic yet</div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] flex justify-around p-3 z-50">
        <button onClick={() => setActiveTab("HOME")} className={`flex flex-col items-center gap-1 ${activeTab === "HOME" ? "opacity-100" : "opacity-50"}`}>
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <span className="text-[8px] font-black">HOME</span>
        </button>
        <button onClick={() => setActiveTab("LINKS")} className={`flex flex-col items-center gap-1 ${activeTab === "LINKS" ? "opacity-100" : "opacity-50"}`}>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47A3 3 0 1015 8z"></path></svg>
          <span className="text-[8px] font-black">LINKS</span>
        </button>
        <button onClick={() => setActiveTab("WITHDRAW")} className={`flex flex-col items-center gap-1 ${activeTab === "WITHDRAW" ? "opacity-100" : "opacity-50"}`}>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"></path></svg>
          <span className="text-[8px] font-black">WITHDRAW</span>
        </button>
        <button onClick={() => setActiveTab("SETTINGS")} className={`flex flex-col items-center gap-1 ${activeTab === "SETTINGS" ? "opacity-100" : "opacity-50"}`}>
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"></path></svg>
          <span className="text-[8px] font-black">SETTINGS</span>
        </button>
      </nav>
    </div>
  );
          }
  
