"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, doc } from "firebase/firestore";

export default function Dashboard({ user }) {
  const [clicks, setClicks] = useState(0);
  const [balance, setBalance] = useState(0);
  const [cpm, setCpm] = useState(2);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Real-time Data Sync
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) setBalance(doc.data().walletBalance || 0);
    });
    const unsubCpm = onSnapshot(doc(db, "settings", "global"), (doc) => {
        if (doc.exists()) setCpm(doc.data().cpm || 2);
    });
    const q = query(collection(db, "urls"), where("userId", "==", user.uid));
    const unsubUrls = onSnapshot(q, (snapshot) => {
        let total = 0;
        let linkList = [];
        snapshot.forEach(doc => { 
            total += doc.data().clicks || 0;
            linkList.push({ id: doc.id, ...doc.data() });
        });
        setClicks(total);
        setLinks(linkList);
    });

    return () => { unsubUser(); unsubCpm(); unsubUrls(); };
  }, [user]);

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
      {/* NAVBAR */}
      <nav className="flex justify-between items-center mb-6 border-b border-[#1f2937] pb-4">
        <h1 className="font-black text-lg italic">C2E DASHBOARD</h1>
        <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black">LG</div>
      </nav>

      {/* STATS */}
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

      {/* GENERATOR */}
      <div className="bg-[#0b0e14] p-6 rounded-3xl border border-[#1f2937] mb-8">
        <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-sm" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-sm" placeholder="Custom Alias (Optional)" value={alias} onChange={(e) => setAlias(e.target.value)} />
        <button onClick={generateLink} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Generate Link</button>
        {generatedLink && <div className="mt-4 p-3 bg-black rounded-xl border border-purple-900 text-[10px] break-all">{generatedLink}</div>}
      </div>

      {/* TRAFFIC ANALYSIS */}
      <div className="bg-[#0b0e14] rounded-3xl p-6 border border-[#1f2937]">
        <h2 className="text-xs font-black uppercase mb-4 italic text-gray-400">Traffic Analysis</h2>
        <div className="space-y-3">
            {links.map(link => (
                <div key={link.id} className="flex justify-between bg-[#131722] p-3 rounded-xl text-[10px]">
                    <span className="truncate w-1/2">{link.originalUrl}</span>
                    <span className="font-black text-purple-400">{link.clicks} Clicks</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
  }
