"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { if (u) setUser(u); });
  }, []);

  const handleGenerate = async () => {
    if (!url) return alert("URL daalo!");
    if (!user) return alert("Login karo!");

    const shortCode = alias || Math.random().toString(36).substring(7);
    
    try {
        await setDoc(doc(db, "urls", shortCode), { 
            code: shortCode, 
            originalUrl: url.startsWith('http') ? url : `https://${url}`, 
            userId: user.uid, 
            clicks: 0 
        });
        setGeneratedLink(`https://click-to-earn-money.vercel.app/${shortCode}`);
        setUrl(""); setAlias("");
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Clicks</p><p className="text-lg font-black">0</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Earnings</p><p className="text-lg font-black text-purple-500">$0.00</p></div>
        </div>
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
          {generatedLink && (
            <div className="mt-4 flex items-center gap-2 bg-[#0b0e14] p-3 rounded-xl border border-purple-500">
                <p className="text-xs text-purple-400 flex-1 truncate">{generatedLink}</p>
                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="bg-purple-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Copy</button>
            </div>
          )}
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
}
