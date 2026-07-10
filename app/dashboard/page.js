"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [url, setUrl] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    const saved = JSON.parse(localStorage.getItem("myLinks") || "[]");
    const newLink = { 
      id: Date.now(), 
      url: url, 
      alias: "c2e.com/" + Date.now().toString().slice(-4), 
      clicks: 0 
    };
    localStorage.setItem("myLinks", JSON.stringify([newLink, ...saved]));
    alert("Link Generated!");
    setUrl("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Dashboard</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Tumhara original card design */}
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
