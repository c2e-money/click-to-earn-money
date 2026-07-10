"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    const newLink = { id: Date.now(), url: url, clicks: 0 };
    setLinks([newLink, ...links]);
    setUrl("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[9px] font-black uppercase mb-3 text-gray-400">Create New Link</h2>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-500">Recent Links</p>
          {links.map((link) => (
            <div key={link.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold truncate w-40">{link.url}</p>
                <p className="text-[9px] text-emerald-400 font-bold">{link.clicks} Clicks</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(link.url)} className="text-[10px] bg-[#1f2937] px-3 py-1 rounded-lg font-black uppercase">Copy</button>
            </div>
          ))}
        </div>
      </main>
      <Navbar active="links" />
    </div>
  );
}
