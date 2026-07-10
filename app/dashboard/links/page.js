"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Links() {
  const [links, setLinks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("loggedInUserId");
      if (!userId) return;
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) setLinks(docSnap.data().links || []);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {links.map((l) => (
          <div key={l.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
            <div><p className="text-xs font-bold">{l.alias}</p><p className="text-[9px] text-gray-400">{l.url}</p></div>
            <button onClick={() => navigator.clipboard.writeText(l.alias)} className="text-[10px] bg-[#1f2937] px-3 py-1 rounded-lg font-black uppercase">Copy</button>
          </div>
        ))}
      </main>
      <Navbar active="links" />
    </div>
  );
}
