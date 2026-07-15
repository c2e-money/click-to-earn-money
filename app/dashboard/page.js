"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clicks: 0, earnings: 0, walletBalance: 0, cpm: 0 });
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) setData(prev => ({ ...prev, ...doc.data() }));
    });
    const fetchCpm = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "global"));
        if (snap.exists()) setData(prev => ({ ...prev, cpm: snap.data().cpm }));
      } catch (e) { console.error(e); }
    };
    fetchCpm();
    return () => unsubUser();
  }, [user]);

  const generateLink = async () => {
    if (!user?.uid) return alert("Login required!");
    if (!url) return alert("Enter URL");
    try {
      const code = alias || Math.random().toString(36).substring(7);
      
      // Fix: setDoc for correct routing
      await setDoc(doc(db, "urls", code), {
        originalUrl: url.startsWith('http') ? url : `https://${url}`,
        code: code,
        userId: user.uid,
        clicks: 0,
        createdAt: serverTimestamp()
      });
      
      setGeneratedLink(`${window.location.origin}/go/${code}`);
      setUrl(""); setAlias("");
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen font-sans pb-24">
      <header className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
        <div className="w-9 h-9 flex items-center justify-center bg-purple-600 rounded-full font-black text-[10px]">C2E</div>
      </header>

      <main className="p-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Clicks</p>
            <h2 className="text-lg font-black">{data.clicks || 0}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Wallet</p>
            <h2 className="text-lg font-black">${(data.walletBalance || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Global CPM</p>
            <h2 className="text-lg font-black">${(data.cpm || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Total Earnings</p>
            <h2 className="text-lg font-black text-emerald-400 italic">${(data.earnings || 0).toFixed(2)}</h2>
          </div>
        </div>

        {/* Link Generator */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs outline-none" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs outline-none" placeholder="Custom Alias (Optional)" value={alias} onChange={(e) => setAlias(e.target.value)} />
          <button onClick={generateLink} className="w-full bg-purple-600 py-3 rounded-xl font-black uppercase text-[11px]">Generate Link</button>
          
          {generatedLink && (
            <div className="mt-4 p-3 bg-[#1f2937] rounded-xl flex justify-between items-center text-xs">
              <span className="truncate">{generatedLink}</span>
              <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="ml-2 bg-purple-500 px-3 py-1 rounded font-bold">COPY</button>
            </div>
          )}
        </div>

        {/* Traffic Analysis (Restored) */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mt-6">
          <h2 className="text-[10px] font-black uppercase mb-4 italic text-gray-500">Traffic Analysis</h2>
          <div className="text-center text-[10px] text-gray-700 py-4 italic">No traffic yet</div>
        </div>
      </main>

      <Navbar active="home" />
    </div>
  );
            }
                                                                                                                                                                                 
