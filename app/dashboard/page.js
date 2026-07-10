"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clicks: 0, earnings: 0, withdrawal: 0, cpm: 0 });
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) setData(prev => ({ ...prev, ...doc.data() }));
    });
    return () => unsubUser();
  }, [user]);

  const generateLink = async () => {
    if (!user?.uid) return alert("Login karo!");
    try {
      const code = alias || Math.random().toString(36).substring(7);
      await addDoc(collection(db, "urls"), {
        originalUrl: url,
        shortCode: code,
        userId: user.uid,
        createdAt: new Date()
      });
      setGeneratedLink(`https://c2e.com/${code}`);
      setUrl(""); setAlias("");
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen font-sans pb-24">
      <header className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
        <div className="w-9 h-9 flex items-center justify-center bg-purple-600 rounded-full font-black text-[10px]">C2E</div>
      </header>

      {activeTab === "HOME" && (
        <main className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] uppercase font-black text-gray-500">Clicks</p><h2 className="text-lg font-black">{data.clicks}</h2></div>
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] uppercase font-black text-gray-500">Withdrawal</p><h2 className="text-lg font-black">${(data.withdrawal || 0).toFixed(2)}</h2></div>
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] uppercase font-black text-gray-500">CPM</p><h2 className="text-lg font-black">${(data.cpm || 0).toFixed(2)}</h2></div>
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[8px] uppercase font-black text-gray-500">Earnings</p><h2 className="text-lg font-black text-emerald-400 italic">${(data.earnings || 0).toFixed(2)}</h2></div>
          </div>

          <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
            <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs" placeholder="Custom Alias" value={alias} onChange={(e) => setAlias(e.target.value)} />
            <button onClick={generateLink} className="w-full bg-purple-600 py-3 rounded-xl font-black uppercase text-[11px]">Generate Link</button>
            
            {generatedLink && (
              <div className="mt-4 p-3 bg-[#1f2937] rounded-xl flex justify-between items-center">
                <span className="text-xs truncate">{generatedLink}</span>
                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="text-[10px] bg-purple-500 px-2 py-1 rounded">COPY</button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] flex justify-around p-3 z-50">
        <button onClick={() => setActiveTab("HOME")} className="flex flex-col items-center"><span className="text-[9px] font-black">HOME</span></button>
        <button onClick={() => setActiveTab("LINKS")} className="flex flex-col items-center"><span className="text-[9px] font-black">LINKS</span></button>
        <button onClick={() => setActiveTab("WITHDRAW")} className="flex flex-col items-center"><span className="text-[9px] font-black">WITHDRAW</span></button>
        <button onClick={() => setActiveTab("SETTINGS")} className="flex flex-col items-center"><span className="text-[9px] font-black">SETTINGS</span></button>
      </nav>
    </div>
  );
        }
        
