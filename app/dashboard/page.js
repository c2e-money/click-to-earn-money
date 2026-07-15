"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clicks: 0, earnings: 0, walletBalance: 0, cpm: 0, dailyClicks: {} });
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [todayIndex, setTodayIndex] = useState(0);
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const day = new Date().getDay();
    setTodayIndex(day === 0 ? 6 : day - 1);
  }, []);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) setData(prev => ({ ...prev, ...doc.data() }));
    });
    
    const fetchCpm = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "global"));
        if (snap.exists()) setData(prev => ({ ...prev, cpm: snap.data().cpm }));
      } catch (e) { console.error(e); }
    };
    fetchCpm();
    
    return () => unsubUser();
  }, [user]);

  const generateLink = async () => {
    if (!user?.uid) return alert("Login required!");
    if (!url) return alert("Enter URL");
    
    setIsGenerating(true); 
    try {
      const code = alias || Math.random().toString(36).substring(7);
      await setDoc(doc(db, "urls", code), {
        originalUrl: url.startsWith('http') ? url : `https://${url}`,
        code: code,
        userId: user.uid,
        clicks: 0,
        createdAt: serverTimestamp()
      });
      setGeneratedLink(`${window.location.origin}/go/${code}`);
      setUrl(""); setAlias("");
    } catch (e) { alert(e.message); } 
    finally { setIsGenerating(false); }
  };

  const todayClicks = data.dailyClicks ? (data.dailyClicks[weekLabels[todayIndex]] || 0) : 0;

  return (
    <div className="bg-[#050608] text-white min-h-screen font-sans pb-24">
      <header className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
        <div className="w-9 h-9 flex items-center justify-center bg-purple-600 rounded-full font-black text-[10px]">C2E</div>
      </header>

      <main className="p-4">
        {/* CARDS: Total Clicks, Available Wallet, Global CPM, Total Earnings */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Total Clicks</p>
            <h2 className="text-lg font-black">{data.clicks || 0}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-emerald-500">Available Wallet</p>
            <h2 className="text-lg font-black text-emerald-400">${(data.walletBalance || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Global CPM</p>
            <h2 className="text-lg font-black">${(data.cpm || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Total Earnings</p>
            <h2 className="text-lg font-black italic">${(data.earnings || 0).toFixed(2)}</h2>
          </div>
        </div>

        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs outline-none focus:border-purple-500 transition-colors" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs outline-none focus:border-purple-500 transition-colors" placeholder="Custom Alias (Optional)" value={alias} onChange={(e) => setAlias(e.target.value)} />
          
          <button onClick={generateLink} disabled={isGenerating} className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-black uppercase text-[11px] flex justify-center items-center gap-2 transition-all ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
            {isGenerating ? "Generating..." : "Generate Link"}
          </button>
          
          {generatedLink && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500 rounded-xl flex justify-between items-center text-xs text-purple-400">
              <span className="truncate">{generatedLink}</span>
              <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="ml-2 bg-purple-600 text-white px-3 py-1 rounded font-bold text-[10px]">COPY</button>
            </div>
          )}
        </div>

        {/* Dynamic DAILY Traffic Analysis */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mt-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-[10px] font-black uppercase mb-4 italic text-gray-500">This Week's Traffic</h2>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Today's Traffic</p>
                <p className="text-2xl font-black text-emerald-400">{todayClicks}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-bold">Status</p>
                <p className={`text-xs font-bold ${todayClicks > 0 ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`}>
                  {todayClicks > 0 ? '● Live' : 'No Traffic'}
                </p>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-24 gap-1.5 mt-4 border-b border-[#1f2937] pb-1">
              {weekLabels.map((dayName, index) => {
                const isToday = index === todayIndex;
                const isFuture = index > todayIndex;
                const dayClicks = data.dailyClicks ? (data.dailyClicks[dayName] || 0) : 0;
                const height = Math.min(dayClicks, 100); 

                return (
                  <div key={index} className="w-full flex flex-col justify-end items-center h-full group">
                    {!isFuture && (
                      <div
                        className={`w-full rounded-t-sm transition-all duration-1000 ease-out ${isToday ? "bg-gradient-to-t from-emerald-600 to-emerald-400" : "bg-gradient-to-t from-[#1f2937] to-purple-900/40"}`}
                        style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0px' }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between text-[8px] font-bold uppercase px-1">
              {weekLabels.map((label, index) => (
                <span key={index} className={`${index === todayIndex ? "text-emerald-500" : index > todayIndex ? "text-[#1f2937]" : "text-gray-600"}`}>
                  {index === todayIndex ? "Today" : label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
  }
            
