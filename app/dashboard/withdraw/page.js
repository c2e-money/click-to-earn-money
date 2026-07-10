"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Withdraw() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("loggedInUserId") || "guest";
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) setHistory(docSnap.data().withdrawals || []);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">WITHDRAW</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {history.map(h => <div key={h.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center text-xs">...</div>)}
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
