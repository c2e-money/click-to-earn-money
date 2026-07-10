"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

export default function Dashboard({ user }) {
  // --- STATE VARIABLES (Purana Logic) ---
  const [clicks, setClicks] = useState(0);
  const [balance, setBalance] = useState(0);
  const [cpm, setCpm] = useState(2);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [links, setLinks] = useState([]); // Traffic Analysis ke liye

  useEffect(() => {
    if (!user) return;

    // 1. User ka Balance (Real-time)
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) setBalance(doc.data().walletBalance || 0);
    });

    // 2. Global CPM (Real-time)
    const unsubCpm = onSnapshot(doc(db, "settings", "global"), (doc) => {
        if (doc.exists()) setCpm(doc.data().cpm || 2);
    });

    // 3. User ke saare Links aur Unke Total Clicks (Real-time)
    const q = query(collection(db, "urls"), where("userId", "==", user.uid));
    const unsubUrls = onSnapshot(q, (snapshot) => {
        let totalClicks = 0;
        let linkList = [];
        snapshot.forEach(doc => { 
            const data = doc.data();
            totalClicks += data.clicks || 0;
            linkList.push({ id: doc.id, ...data });
        });
        setClicks(totalClicks);
        setLinks(linkList);
    });

    return () => { unsubUser(); unsubCpm(); unsubUrls(); };
  }, [user]);

  // --- GENERATE LINK LOGIC (Purana Logic) ---
  const generateLink = async () => {
    if(!url) return alert("URL daalo!");
    const finalAlias = alias || Math.random().toString(36).substring(7);
    
    await addDoc(collection(db, "urls"), {
        originalUrl: url,
        code: finalAlias,
        userId: user.uid,
        clicks: 0
    });
    setGeneratedLink(`https://click-to-earn-money.vercel.app/${finalAlias}`);
    setAlias(""); setUrl("");
  };

  return (
    <div className="p-4 bg-[#050608] text-white min-h-screen">
      {/* HEADER STATS (Purana UI) */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-black uppercase">Clicks</p>
            <h2 className="text-xl font-black">{clicks}</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-black uppercase">Earnings</p>
            <h2 className="text-xl font-black italic text-emerald-400">${balance.toFixed(4)}</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-black uppercase">CPM</p>
            <h2 className="text-xl font-black">${cpm}</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-black uppercase">Withdrawal</p>
            <h2 className="text-xl font-black italic">$6.00</h2>
        </div>
      </div>

      {/* GENERATOR UI */}
      <div className="bg-[#0b0e14] p-6 rounded-3xl border border-[#1f2937] mb-8">
        <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937]" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937]" placeholder="Custom Alias (Optional)" value={alias} onChange={(e) => setAlias(e.target.value)} />
        <button onClick={generateLink} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Generate Link</button>
        {generatedLink && <p className="mt-4 text-[10px] break-all bg-black p-2 rounded border border-purple-900">{generatedLink}</p>}
      </div>

      {/* TRAFFIC ANALYSIS (Purana Logic) */}
      <div className="bg-[#0b0e14] rounded-3xl p-6 border border-[#1f2937]">
        <h2 className="text-xs font-black uppercase mb-4 italic text-gray-400">Traffic Analysis</h2>
        <div className="space-y-3">
            {links.map(link => (
                <div key={link.id} className="flex justify-between bg-[#131722] p-3 rounded-xl text-[10px]">
                    <span>{link.code}</span>
                    <span className="font-black text-purple-400">{link.clicks} Clicks</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
                       }
