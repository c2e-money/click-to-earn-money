"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [data, setData] = useState({ balance: 0.00, clicks: 0 });

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0e14] text-white p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-xl font-black italic uppercase">CLICK TO EARN</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30"></div>
      </header>

      {/* Balance Section - The Lure */}
      <div className="bg-gradient-to-br from-[#1a1c29] to-[#131722] p-8 rounded-3xl border border-[#1f2937] text-center mb-8 shadow-2xl">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Available Balance</p>
        <p className="text-5xl font-black text-emerald-400 my-3">${data.balance.toFixed(2)}</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase">Keep shortening to grow your earnings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#131722] p-5 rounded-2xl border border-[#1f2937]">
          <p className="text-[9px] text-gray-500 font-bold uppercase">Total Clicks</p>
          <p className="text-xl font-black">{data.clicks}</p>
        </div>
        <div className="bg-[#131722] p-5 rounded-2xl border border-[#1f2937]">
          <p className="text-[9px] text-gray-500 font-bold uppercase">Avg CPM</p>
          <p className="text-xl font-black text-purple-400">$4.50</p>
        </div>
      </div>

      {/* Link Shortener */}
      <div className="bg-[#131722] p-6 rounded-3xl border border-[#1f2937] mb-8">
        <h2 className="text-sm font-black mb-4 uppercase">Shorten New Link</h2>
        <input type="text" placeholder="Paste your long URL here..." className="w-full bg-[#0b0e14] border border-[#1f2937] p-4 rounded-xl mb-3 text-sm focus:border-purple-500 outline-none" />
        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl font-black text-sm hover:opacity-90 transition">
          SHORTEN URL
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14]/90 backdrop-blur-md border-t border-[#1f2937] flex justify-around p-4">
        <div className="text-purple-400 font-black text-[10px] uppercase">Home</div>
        <div className="text-gray-500 font-black text-[10px] uppercase">Links</div>
        <div className="text-gray-500 font-black text-[10px] uppercase">Withdraw</div>
      </nav>
    </main>
  );
        }
