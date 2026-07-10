"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, doc } from "firebase/firestore";

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("HOME");
  const [clicks, setClicks] = useState(0);
  const [balance, setBalance] = useState(0);
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) setBalance(doc.data().walletBalance || 0);
    });
    const q = query(collection(db, "urls"), where("userId", "==", user.uid));
    const unsubUrls = onSnapshot(q, (snapshot) => {
        let total = 0; let list = [];
        snapshot.forEach(doc => { total += doc.data().clicks || 0; list.push({id: doc.id, ...doc.data()}); });
        setClicks(total); setLinks(list);
    });
    return () => { unsubUser(); unsubUrls(); };
  }, [user]);

  const generateLink = async () => {
    const finalAlias = alias || Math.random().toString(36).substring(7);
    await addDoc(collection(db, "urls"), { originalUrl: url, code: finalAlias, userId: user.uid, clicks: 0 });
    alert("Link Generated!");
    setUrl(""); setAlias("");
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen pb-20">
      <nav className="p-4 border-b border-[#1f2937] flex justify-between items-center">
        <h1 className="font-black text-lg italic">C2E DASHBOARD</h1>
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-black">LG</div>
      </nav>

      <div className="p-4">
        {activeTab === "HOME" && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] text-gray-500 uppercase font-black">Clicks</p><h2 className="text-lg font-black">{clicks}</h2></div>
              <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] text-gray-500 uppercase font-black">Earnings</p><h2 className="text-lg font-black italic text-emerald-400">${balance.toFixed(4)}</h2></div>
            </div>
            <input className="w-full bg-[#0b0e14] p-4 rounded-2xl mb-2 border border-[#1f2937] text-sm" placeholder="Paste URL..." onChange={(e) => setUrl(e.target.value)} />
            <input className="w-full bg-[#0b0e14] p-4 rounded-2xl mb-4 border border-[#1f2937] text-sm" placeholder="Custom Alias (Optional)" onChange={(e) => setAlias(e.target.value)} />
            <button onClick={generateLink} className="w-full bg-purple-600 p-4 rounded-2xl font-black uppercase text-sm">Generate Link</button>
          </>
        )}

        {activeTab === "LINKS" && (
          <div className="space-y-3">
            {links.map(link => (
              <div key={link.id} className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937] flex justify-between text-[10px]">
                <span className="truncate w-1/2">{link.originalUrl}</span>
                <span className="font-black text-purple-400">{link.clicks} Clicks</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "WITHDRAW" && (
            <div className="text-center mt-10">
                <h2 className="text-xl font-black mb-4">Balance: ${balance.toFixed(2)}</h2>
                <button className="bg-emerald-600 w-full py-4 rounded-2xl font-black uppercase">Request Withdrawal</button>
            </div>
        )}

        {activeTab === "SETTINGS" && (
            <div className="space-y-4">
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">Profile Settings (Coming Soon)</div>
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">Dark Mode Enabled</div>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] flex justify-around p-4">
        {["HOME", "LINKS", "WITHDRAW", "SETTINGS"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`font-black text-[9px] ${activeTab === tab ? "text-purple-500" : "text-gray-500"}`}>
                {tab}
            </button>
        ))}
      </div>
    </div>
  );
    }
                                                                                                                                                                        
