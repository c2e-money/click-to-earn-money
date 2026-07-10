"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  // Yahan links ki history ayegi
  const [links] = useState([
    { id: 1, url: "c2e.com/sample-link-1", clicks: 12 },
    { id: 2, url: "c2e.com/another-big-link", clicks: 5 }
  ]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      {/* Header */}
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        {/* Create Link Section */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[9px] font-black uppercase mb-3 text-gray-400">Create New Link</h2>
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <input type="text" placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <button className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>

        {/* Links History */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-500">Recent Links</p>
          
          {links.map((link) => (
            <div key={link.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold truncate w-40">{link.url}</p>
                <p className="text-[9px] text-emerald-400 font-bold">{link.clicks} Clicks</p>
              </div>
              <button className="text-[10px] bg-[#1f2937] px-3 py-1 rounded-lg font-black uppercase">Copy</button>
            </div>
          ))}
        </div>
      </main>

      {/* Navbar Integration */}
      <Navbar active="links" />
    </div>
  );
}
