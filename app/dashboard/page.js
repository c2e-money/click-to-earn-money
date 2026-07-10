"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { db, auth } from "@/lib/firebase"; // auth bhi import kiya
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase se direct login user utha rahe hain
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
  }, []);

  const handleGenerate = async () => {
    if (!url) return alert("Please enter a URL!"); // Sirf URL check
    if (!user) return alert("Please login first!"); // User check

    const newLink = { 
        id: Date.now(), 
        url, 
        alias: alias || "c2e.com/" + Date.now().toString().slice(-4), 
        clicks: 0 
    };
    
    try {
        await setDoc(doc(db, "users", user.uid), { links: arrayUnion(newLink) }, { merge: true });
        alert("Link Generated!");
        setUrl(""); setAlias("");
    } catch (error) {
        alert("Error saving link: " + error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">DASHBOARD</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Total Clicks</p><p className="text-lg font-black text-white">0</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Total Withdrawal</p><p className="text-lg font-black text-emerald-400">$0.00</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Current CPM</p><p className="text-lg font-black text-white">$0.00</p></div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] font-bold text-gray-500 uppercase">Total Earnings</p><p className="text-lg font-black text-purple-500">$0.00</p></div>
        </div>

        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Custom Alias (Optional)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] mb-3 text-sm outline-none" />
          <button onClick={handleGenerate} className="w-full bg-purple-600 p-3 rounded-xl font-black text-xs uppercase">Generate Link</button>
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
  }
  
