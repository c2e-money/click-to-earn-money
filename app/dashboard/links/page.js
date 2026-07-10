"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setLinks(docSnap.data().links || []);
          }
        } catch (error) {
          console.error("Error fetching:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      {/* Original Header Design */}
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {loading ? (
            <p className="text-center text-xs text-gray-500 mt-10">Loading your links...</p>
        ) : links.length > 0 ? (
            links.map((l) => (
              <div key={l.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-white uppercase">{l.alias}</p>
                  <p className="text-[9px] text-gray-500 truncate max-w-[180px]">{l.url}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(l.alias)} 
                  className="bg-purple-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider"
                >
                  Copy
                </button>
              </div>
            ))
        ) : (
            <div className="text-center mt-10 bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
                <p className="text-xs font-bold text-gray-500 uppercase">Koi link generate nahi kiya!</p>
            </div>
        )}
      </main>
      
      <Navbar active="links" />
    </div>
  );
}
