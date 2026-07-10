"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ clicks: 0, earnings: 0, cpm: 5.00, withdraw: 0 });

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userSnap = await getDoc(doc(db, "users", u.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setStats({ clicks: data.totalClicks || 0, earnings: data.totalEarnings || 0, cpm: data.cpm || 5.00, withdraw: data.walletBalance || 0 });
        }
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!url || !user) return;
    const finalAlias = alias || Math.random().toString(36).substring(7);
    try {
        await setDoc(doc(db, "urls", finalAlias), { code: finalAlias, originalUrl: url.startsWith('http') ? url : `https://${url}`, userId: user.uid, clicks: 0 });
        setGeneratedLink(`https://click-to-earn-money.vercel.app/${finalAlias}`);
        setUrl(""); setAlias("");
    } catch (e) { alert("Error!"); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center">
        <h1 className="text-lg font-black italic uppercase">C2E DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Clicks</p><p className="text-lg font-black">{stats.clicks}</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Withdrawal</p><p className="text-lg font-black text-emerald-400">${stats.withdraw.toFixed(2)}</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">CPM</p><p className="text-lg font-black">${stats.cpm.toFixed(2)}</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Earnings</p><p className="text-lg font-black text-purple-500">${stats.earnings.toFixed(2)}</p></div>
        </div>

        {/* Link Generator */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm text-white placeholder-gray-500" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm text-white placeholder-gray-500" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
          {generatedLink && <div className="mt-4 p-3 rounded-xl border border-purple-500 bg-[#0b0e14] text-[10px] text-purple-400 break-all">{generatedLink}</div>}
        </div>

        {/* Traffic Graph */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] font-black uppercase text-gray-500 mb-4">Traffic Analysis</p>
          <div className="h-24 flex items-end gap-2">{[40, 70, 45, 90, 60].map((h, i) => <div key={i} className="flex-1 bg-[#1f2937] rounded-t-lg"><div style={{ height: `${h}%` }} className="bg-purple-600 rounded-t-lg"></div></div>)}</div>
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
}
