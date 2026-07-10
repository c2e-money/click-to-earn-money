"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const fetchLinks = async (uid) => {
    const q = query(collection(db, "urls"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setLinks(snap.docs.map(doc => ({ code: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { if (u) { setUser(u); fetchLinks(u.uid); } });
  }, []);

  const handleGenerate = async () => {
    if (!url || !user) return alert("URL daalo!");
    setLoading(true);
    const finalAlias = alias || Math.random().toString(36).substring(7);
    try {
        await setDoc(doc(db, "urls", finalAlias), { code: finalAlias, originalUrl: url.startsWith('http') ? url : `https://${url}`, userId: user.uid, clicks: 0 });
        setGenerated(`https://click-to-earn-money.vercel.app/${finalAlias}`);
        setUrl(""); setAlias("");
        fetchLinks(user.uid);
    } catch (e) { alert("Error!"); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase">My Links</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm text-white" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm text-white" />
          <button onClick={handleGenerate} disabled={loading} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">
            {loading ? "Generating..." : "Generate Link"}
          </button>
          {generated && !loading && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500 rounded-xl text-[10px] text-purple-400 break-all">
              {generated}
              <button onClick={() => navigator.clipboard.writeText(generated)} className="ml-2 bg-purple-600 px-2 py-1 rounded">COPY</button>
            </div>
          )}
        </div>
        {links.map(l => (
          <div key={l.code} className="bg-[#131722] p-4 rounded-2xl flex justify-between items-center border border-[#1f2937]">
            <p className="text-[10px] text-white font-black uppercase">/{l.code}</p>
            <button onClick={() => navigator.clipboard.writeText(`https://click-to-earn-money.vercel.app/${l.code}`)} className="bg-purple-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase">Copy</button>
          </div>
        ))}
      </main>
      <Navbar active="links" />
    </div>
  );
          }
