"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
  }, []);

  const handleGenerate = async () => {
    if (!url) return alert("URL daalo!");
    if (!user) return alert("Login karo!");

    const shortAlias = alias || "c2e.com/" + Date.now().toString().slice(-4);
    const newLink = { id: Date.now(), url, alias: shortAlias, clicks: 0 };
    
    try {
        await setDoc(doc(db, "users", user.uid), { links: arrayUnion(newLink) }, { merge: true });
        setGeneratedLink(shortAlias);
        setUrl(""); setAlias("");
    } catch (e) { alert("Error!"); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Stats Grid - CPM & Withdrawal wapas aa gaya */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Clicks</p><p className="text-lg font-black text-white">0</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Withdrawal</p><p className="text-lg font-black text-emerald-400">$0.00</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">CPM</p><p className="text-lg font-black text-white">$0.00</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Earnings</p><p className="text-lg font-black text-purple-500">$0.00</p></div>
        </div>

        {/* Generate Box */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
          
          {/* Copy Button Box */}
          {generatedLink && (
            <div className="mt-4 flex items-center gap-2 bg-[#0b0e14] p-3 rounded-xl border border-purple-500">
                <p className="text-xs text-purple-400 flex-1 truncate">{generatedLink}</p>
                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="bg-purple-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Copy</button>
            </div>
          )}
        </div>

        {/* Traffic Analysis */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-4">Traffic Analysis</p>
          <div className="h-32 flex items-end gap-2">
            {[40, 70, 45, 90, 60, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-[#1f2937] rounded-t-lg relative">
                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-purple-600 rounded-t-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
            }
  
