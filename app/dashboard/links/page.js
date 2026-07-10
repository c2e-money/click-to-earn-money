"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [user, setUser] = useState(null);

  const fetchLinks = async (uid) => {
    const q = query(collection(db, "urls"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setLinks(snap.docs.map(doc => ({ code: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchLinks(u.uid);
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!url || !user) return;
    const shortCode = alias || Math.random().toString(36).substring(7);
    try {
        await setDoc(doc(db, "urls", shortCode), { 
            code: shortCode, 
            originalUrl: url.startsWith('http') ? url : `https://${url}`, 
            userId: user.uid, 
            clicks: 0 
        });
        setUrl(""); setAlias("");
        fetchLinks(user.uid); // Nayi list fetch karo
    } catch (e) { alert("Error!"); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center">
        <h1 className="text-lg font-black uppercase">My Links</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Generate Box inside Links Tab */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>

        {/* Links History */}
        <p className="text-[10px] font-black uppercase text-gray-500">Link History</p>
        {links.map(l => (
          <div key={l.code} className="bg-[#131722] p-4 rounded-2xl flex justify-between items-center border border-[#1f2937]">
            <div>
                <p className="text-xs text-white font-bold uppercase">/{l.code}</p>
                <p className="text-[9px] text-gray-500 truncate max-w-[150px]">{l.originalUrl}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(`https://click-to-earn-money.vercel.app/${l.code}`)} className="bg-purple-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase">Copy</button>
          </div>
        ))}
      </main>
      <Navbar active="links" />
    </div>
  );
}
