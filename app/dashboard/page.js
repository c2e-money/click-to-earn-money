"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clicks: 0, earnings: 0, walletBalance: 0, cpm: 0 });
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Graph ke liye week data
  const [todayIndex, setTodayIndex] = useState(0);
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Past days ke liye dummy heights (Taaki dashboard khali na lage)
  const dummyPastData = [30, 60, 45, 85, 50, 75, 65]; 

  // Set Today Index on Mount (0 = Mon, 6 = Sun)
  useEffect(() => {
    const day = new Date().getDay();
    setTodayIndex(day === 0 ? 6 : day - 1);
  }, []);

  // Authentication Check
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubAuth();
  }, []);

  // Fetching User Data and Global CPM
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

  // Generating Short Link with Loading Animation
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
      setUrl(""); 
      setAlias("");
    } catch (e) { 
      alert(e.message); 
    } finally {
      setIsGenerating(false); 
    }
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen font-sans pb-24">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-[#1f2937]">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
        <div className="w-9 h-9 flex items-center justify-center bg-purple-600 rounded-full font-black text-[10px]">C2E</div>
      </header>

      <main className="p-4">
        {/* Top 4 Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Clicks</p>
            <h2 className="text-lg font-black">{data.clicks || 0}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Wallet</p>
            <h2 className="text-lg font-black">${(data.walletBalance || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Global CPM</p>
            <h2 className="text-lg font-black">${(data.cpm || 0).toFixed(2)}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Total Earnings</p>
            <h2 className="text-lg font-black text-emerald-400 italic">${(data.earnings || 0).toFixed(2)}</h2>
          </div>
        </div>

        {/* URL Shortener Input Section */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input 
            className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs outline-none focus:border-purple-500 transition-colors" 
            placeholder="Paste URL..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
          />
          <input 
            className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs outline-none focus:border-purple-500 transition-colors" 
            placeholder="Custom Alias (Optional)" 
            value={alias} 
            onChange={(e) => setAlias(e.target.value)} 
          />
          
          <button 
            onClick={generateLink} 
            disabled={isGenerating}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-black uppercase text-[11px] flex justify-center items-center gap-2 transition-all ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Link"
            )}
          </button>
          
          {generatedLink && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500 rounded-xl flex justify-between items-center text-xs text-purple-400">
              <span className="truncate">{generatedLink}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedLink)} 
                className="ml-2 bg-purple-600 text-white px-3 py-1 rounded font-bold text-[10px]"
              >
                COPY
              </button>
            </div>
          )}
        </div>

        {/* Weekly Traffic Analysis Section */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mt-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-[10px] font-black uppercase mb-4 italic text-gray-500">This Week's Traffic</h2>
          
          {data.clicks >= 0 && (
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">Total Traffic</p>
                  <p className="text-2xl font-black text-emerald-400">{data.clicks}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 uppercase font-bold">Status</p>
                  <p className={`text-xs font-bold ${data.clicks > 0 ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`}>
                    {data.clicks > 0 ? '● Live' : 'No Traffic'}
                  </p>
                </div>
              </div>
              
              {/* CSS Bar Graph (Mon to Sun) */}
              <div className="flex items-end justify-between h-24 gap-1.5 mt-4 border-b border-[#1f2937] pb-1">
                {weekLabels.map((_, index) => {
                  const isPast = index < todayIndex;
                  const isToday = index === todayIndex;
                  const isFuture = index > todayIndex;
                  
                  // EXACT HEIGHT CALCULATION FIX: 1 Click = 1% (Maximum 100%)
                  let height = 0;
                  if (isPast) height = dummyPastData[index];
                  if (isToday) height = Math.min(data.clicks, 100); 

                  return (
                    <div key={index} className="w-full flex flex-col justify-end items-center h-full group">
                      {!isFuture && (
                        <div
                          className={`w-full rounded-t-sm transition-all duration-1000 ease-out ${
                            isToday
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_-2px_10px_rgba(16,185,129,0.3)]"
                              : "bg-gradient-to-t from-[#1f2937] to-purple-900/40 group-hover:to-purple-600/60"
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Graph X-Axis Labels (Mon to Sun) */}
              <div className="flex justify-between text-[8px] font-bold uppercase px-1">
                {weekLabels.map((label, index) => {
                  const isToday = index === todayIndex;
                  const isFuture = index > todayIndex;
                  
                  return (
                    <span 
                      key={index} 
                      className={`${isToday ? "text-emerald-500" : isFuture ? "text-[#1f2937]" : "text-gray-600"}`}
                    >
                      {isToday ? "Today" : label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Navbar active="home" />
    </div>
  );
  }
              
