"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("myLinks");
    if (saved) setLinks(JSON.parse(saved));
  }, []);

  const handleGenerate = () => {
    if (!url) return alert("URL daalo!");
    const newLink = { id: Date.now(), url, alias: alias || "c2e.com/" + Date.now().toString().slice(-4), clicks: 0 };
    const updated = [newLink, ...links];
    setLinks(updated);
    localStorage.setItem("myLinks", JSON.stringify(updated));
    setUrl(""); setAlias("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>
        <div className="space-y-3">
          {links.map((l) => (
            <div key={l.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div><p className="text-xs font-bold">{l.alias}</p><p className="text-[9px] text-gray-400">{l.url}</p></div>
              <button onClick={() => navigator.clipboard.writeText(l.alias)} className="text-[10px] bg-[#1f2937] px-3 py-1 rounded-lg font-black uppercase">Copy</button>
            </div>
          ))}
        </div>
      </main>
      <Navbar active="links" />
    </div>
  );
}
