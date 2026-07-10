"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  const [links, setLinks] = useState([]); // Khali array (No history)
  const [url, setUrl] = useState("");

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    const newLink = { id: Date.now(), url: url, clicks: 0 };
    setLinks([newLink, ...links]); // Naya link history mein add hoga
    setUrl("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">My Links</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] mb-2 text-sm" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-lg font-black text-xs uppercase">Generate Link</button>
        </div>

        {links.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-xs font-bold uppercase">No links generated yet.</div>
        ) : (
          links.map((link) => (
            <div key={link.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold truncate w-40">c2e.com/{link.id.toString().slice(-5)}</p>
                <p className="text-[9px] text-emerald-400 font-bold">{link.clicks} Clicks</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText("c2e.com/" + link.id.toString().slice(-5))} className="text-[10px] bg-purple-600 px-3 py-1 rounded-lg font-black uppercase">Copy</button>
            </div>
          ))
        )}
      </main>
      <Navbar active="links" />
    </div>
  );
}
