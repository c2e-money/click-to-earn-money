"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    
    // Purana data nikalo
    const saved = JSON.parse(localStorage.getItem("myLinks") || "[]");
    
    // Naya link object
    const newLink = { 
      id: Date.now(), 
      url, 
      alias: alias || "c2e.com/" + Date.now().toString().slice(-4), 
      clicks: 0 
    };

    // Save karo
    const updated = [newLink, ...saved];
    localStorage.setItem("myLinks", JSON.stringify(updated));
    
    alert("Link Generate ho gaya!");
    setUrl(""); 
    setAlias("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Link Generation Card */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <h2 className="text-[10px] font-black uppercase mb-3 text-gray-500">Quick Generate</h2>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>
      </main>
      
      <Navbar active="home" />
    </div>
  );
}
