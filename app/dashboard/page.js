"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("loggedInUserId") || "guest");
  }, []);

  const handleGenerate = async () => {
    if (!url || !userId) return;
    const newLink = { id: Date.now(), url, alias: alias || "c2e.com/" + Date.now().toString().slice(-4), clicks: 0 };
    await setDoc(doc(db, "users", userId), { links: arrayUnion(newLink) }, { merge: true });
    alert("Saved!");
    setUrl(""); setAlias("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center"><h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1></header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL..." className="w-full bg-[#131722] p-3 rounded-xl border border-[#1f2937] text-sm" />
        <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate</button>
      </main>
      <Navbar active="home" />
    </div>
  );
}
