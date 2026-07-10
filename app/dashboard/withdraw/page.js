"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

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
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {history.map(h => <div key={h.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">{h.amount}</div>)}
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
