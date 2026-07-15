"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [user, setUser] = useState(null);

  const fetchLinks = async (uid) => {
    const q = query(collection(db, "urls"), where("userId", "==", uid));
    const snap = await getDocs(q);
    setLinks(snap.docs.map(doc => ({ code: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { 
        if (u) { setUser(u); fetchLinks(u.uid); } 
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#050608] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-purple-500">My Links History</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {links.length === 0 ? (
            <p className="text-center text-gray-500 text-xs mt-10 uppercase font-bold">No links created yet.</p>
        ) : (
            links.map(l => (
            <div key={l.code} className="bg-[#0b0e14] p-4 rounded-2xl flex flex-col gap-2 border border-[#1f2937]">
                <div className="flex justify-between items-center">
                    <p className="text-[12px] text-white font-black">/go/{l.code}</p>
                    <span className="bg-[#1f2937] px-2 py-1 rounded text-[9px] font-bold text-emerald-400">{l.clicks} Clicks</span>
                </div>
                <p className="text-[9px] text-gray-500 truncate">{l.originalUrl}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/go/${l.code}`)} 
                  className="w-full mt-2 bg-purple-600/20 text-purple-400 border border-purple-600/50 py-2 rounded-lg text-[10px] font-black uppercase"
                >
                  Copy Short Link
                </button>
            </div>
            ))
        )}
      </main>
      <Navbar active="links" />
    </div>
  );
}
