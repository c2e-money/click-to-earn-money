"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ clicks: 0, earnings: 0, walletBalance: 0, cpm: 0, dailyClicks: {} });
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  
  const [todayIndex, setTodayIndex] = useState(0);
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Weekday logic
  useEffect(() => {
    const day = new Date().getDay();
    setTodayIndex(day === 0 ? 6 : day - 1);
  }, []);

  // Auth check
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) { setUser(u); } else { router.push("/login"); }
    });
    return () => unsubAuth();
  }, [router]);

  // Data Fetching + Ban Logic
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.isBanned) {
            alert("Account Banned!");
            signOut(auth);
            return;
        }
        setData(prev => ({ ...prev, ...userData }));
      }
    });
    
    // Global CPM Fetch
    const fetchSettings = async () => {
        try {
            const settingsSnap = await getDoc(doc(db, "settings", "global"));
            if (settingsSnap.exists()) {
                setData(prev => ({ ...prev, cpm: settingsSnap.data().cpm }));
            }
        } catch (e) { console.error("Error fetching settings:", e); }
    };
    fetchSettings();
    
    return () => unsubUser();
  }, [user]);

  const generateLink = async () => {
    if (!url) return alert("Enter URL");
    setIsGenerating(true); 
    try {
      const code = alias || Math.random().toString(36).substring(7);
      await setDoc(doc(db, "urls", code), {
        originalUrl: url.startsWith('http') ? url : `https://${url}`,
        code, userId: user.uid, clicks: 0, createdAt: serverTimestamp()
      });
      setGeneratedLink(`${window.location.origin}/go/${code}`);
      setUrl(""); setAlias("");
    } catch (e) { alert(e.message); } 
    finally { setIsGenerating(false); }
  };

  const todayClicks = data.dailyClicks ? (data.dailyClicks[weekLabels[todayIndex]] || 0) : 0;

  return (
    <div className="bg-[#050608] text-white min-h-screen pb-24 font-sans">
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="lazyOnload" />
      
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center">
        <h1 className="font-black text-lg italic text-purple-500">C2E DASHBOARD</h1>
      </header>

      <main className="p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-gray-500">Clicks</p>
            <h2 className="text-lg font-black">{data.clicks || 0}</h2>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[8px] uppercase font-black text-emerald-500">Wallet</p>
            <h2 className="text-lg font-black text-emerald-400">${(data.walletBalance || 0).toFixed(2)}</h2>
          </div>
        </div>

        {/* Generate Link */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937] text-xs outline-none" placeholder="Paste URL..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <input className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937] text-xs outline-none" placeholder="Alias (Optional)" value={alias} onChange={(e) => setAlias(e.target.value)} />
          <button onClick={generateLink} disabled={isGenerating} className="w-full bg-purple-600 py-3 rounded-xl font-black uppercase text-[11px] active:scale-95 transition-transform">
            {isGenerating ? "Generating..." : "Generate"}
          </button>
          {generatedLink && <p className="mt-4 text-[10px] text-purple-400 truncate bg-[#050608] p-2 rounded">{generatedLink}</p>}
        </div>

        {/* Traffic Chart */}
        <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mt-6">
          <h2 className="text-[10px] font-black uppercase mb-4 text-gray-500">Traffic Analysis</h2>
          <div className="flex items-end justify-between h-24 gap-1.5">
            {weekLabels.map((day, i) => (
              <div key={i} className="w-full flex flex-col justify-end items-center h-full">
                <div 
                  className={`w-full rounded-t ${i === todayIndex ? "bg-emerald-500" : "bg-purple-900"}`} 
                  style={{ height: `${Math.min((data.dailyClicks?.[day] || 0) * 10, 100)}%`, minHeight: data.dailyClicks?.[day] > 0 ? '4px' : '0px' }}>
                </div>
                <span className="text-[8px] text-gray-600 mt-1">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Navbar active="home" />
    </div>
  );
          }
