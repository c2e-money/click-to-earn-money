"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; 
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Home, Link2, Wallet, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function LinksHistory() {
  const [links, setLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Firebase se user ke saare links realtime mein fetch karna
    const q = query(
      collection(db, "links"), 
      where("userId", "==", auth.currentUser.uid), 
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      setLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-lg font-black italic uppercase">MY LINKS</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {links.map((link) => (
          <div key={link.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-purple-400 truncate w-40">{link.shortUrl}</span>
              <button 
                onClick={() => copyToClipboard(link.shortUrl, link.id)}
                className="bg-purple-600/20 p-1.5 rounded-lg border border-purple-500/30"
              >
                {copiedId === link.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-purple-400" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[9px] text-gray-500 font-bold uppercase truncate w-40">{link.originalUrl}</p>
              <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                {link.clicks || 0} Clicks
              </span>
            </div>
          </div>
        ))}
      </main>

      <nav className="bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
            <Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-purple-400">
            <Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span>
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500">
            <Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span>
        </Link>
      </nav>
    </div>
  );
          }
