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
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) setBalance(doc.data().walletBalance || 0);
    });
    const unsubCpm = onSnapshot(doc(db, "settings", "global"), (doc) => {
        if (doc.exists()) setCpm(doc.data().cpm || 2);
    });
    const q = query(collection(db, "urls"), where("userId", "==", user.uid));
    const unsubUrls = onSnapshot(q, (snapshot) => {
        let total = 0; let list = [];
        snapshot.forEach(doc => { total += doc.data().clicks || 0; list.push(doc.data()); });
        setClicks(total); setLinks(list);
    });
    return () => { unsubUser(); unsubCpm(); unsubUrls(); };
  }, [user]);

  const generateLink = async () => {
    if(!url) return alert("URL daalo!");
    const finalAlias = alias || Math.random().toString(36).substring(7);
    await addDoc(collection(db, "urls"), { originalUrl: url, code: finalAlias, userId: user.uid, clicks: 0 });
    setGeneratedLink(`https://click-to-earn-money.vercel.app/${finalAlias}`);
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen pb-20">
      {/* HEADER WITH GRAVATAR/LOGO */}
      <nav className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic">C2E DASHBOARD</h1>
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-black text-[10px]">LG</div>
      </nav>

      {/* STATS */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[8px] text-gray-500 uppercase font-black">Clicks</p>
          <h2 className="text-lg font-black">{clicks}</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[8px] text-gray-500 uppercase font-black">Withdrawal</p>
          <h2 className="text-lg font-black">$6.00</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[8px] text-gray-500 uppercase font-black">CPM</p>
          <h2 className="text-lg font-black">${cpm}</h2>
        </div>
        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
          <p className="text-[8px] text-gray-500 uppercase font-black">Earnings</p>
          <h2 className="text-lg font-black text-emerald-400 italic">${balance.toFixed(4)}</h2>
        </div>
      </div>

      {/* GENERATOR */}
      <div className="p-4">
        <input className="w-full bg-[#0b0e14] p-4 rounded-2xl mb-2 border border-[#1f2937] text-sm" placeholder="Paste URL..." onChange={(e) => setUrl(e.target.value)} />
        <input className="w-full bg-[#0b0e14] p-4 rounded-2xl mb-4 border border-[#1f2937] text-sm" placeholder="Custom Alias (Optional)" onChange={(e) => setAlias(e.target.value)} />
        <button onClick={generateLink} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase text-sm">Generate Link</button>
        {generatedLink && <div className="mt-4 p-3 bg-black rounded-xl border border-purple-900 text-[10px] break-all">{generatedLink}</div>}
      </div>

      {/* BOTTOM NAV BAR */}
      <div className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] flex justify-around p-4">
        <div className="text-center font-black text-xs text-purple-500">HOME</div>
        <div className="text-center font-black text-xs text-gray-500">LINKS</div>
        <div className="text-center font-black text-xs text-gray-500">WITHDRAW</div>
      </div>
    </div>
  );
                                                                                                                                                                    }
          
