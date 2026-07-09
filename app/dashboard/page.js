"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === "banned") {
            alert("Account suspended by Admin.");
            signOut(auth);
            router.push("/login");
          } else {
            setUserData(data);
          }
        }
      });
      return () => unsub();
    }
  }, [router]);

  // Bug Fix: URL Ab Direct User ID ke sath save hoga
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;
    setLoading(true);
    try {
      const shortCode = alias.trim() || Math.random().toString(36).substring(2, 8);
      
      await addDoc(collection(db, "urls"), {
        originalUrl: longUrl,
        code: shortCode,
        clicks: 0,
        userId: auth.currentUser.uid, // 🔒 Connected to logged-in user
        createdAt: serverTimestamp()
      });
      
      setShortUrl(`${window.location.origin}/${shortCode}`);
      setLongUrl("");
      setAlias("");
    } catch (error) {
      alert("Error: Database permission denied or alias already exists.");
    }
    setLoading(false);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-20">
      
      {/* Top Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-5 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-neutral-950 p-1.5 rounded-lg text-lg">⚡</span>
          <h1 className="text-xl font-black text-white tracking-wide">LG Click To Earn</h1>
        </div>
        <button onClick={() => signOut(auth)} className="text-neutral-400 hover:text-red-400 text-sm font-bold transition">
          Logout
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto mt-4">
        <p className="text-neutral-400 text-sm mb-4">Track your performance.</p>

        {/* Stats Grid - Dark UI */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <p className="text-[11px] font-bold text-neutral-500 mb-1 tracking-wider uppercase">Wallet</p>
            <p className="text-2xl font-black text-white">${userData.walletBalance?.toFixed(4) || "0.0000"}</p>
          </div>
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <p className="text-[11px] font-bold text-neutral-500 mb-1 tracking-wider uppercase">CPM</p>
            <p className="text-2xl font-black text-emerald-400">${userData.cpm?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <p className="text-[11px] font-bold text-neutral-500 mb-1 tracking-wider uppercase">Total Earnings</p>
            <p className="text-2xl font-black text-white">${userData.totalEarnings?.toFixed(4) || "0.0000"}</p>
          </div>
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 opacity-10 rounded-bl-full"></div>
            <p className="text-[11px] font-bold text-neutral-500 mb-1 tracking-wider uppercase">Total Clicks</p>
            <p className="text-2xl font-black text-emerald-400">{userData.totalClicks || 0}</p>
          </div>
        </div>

        {/* URL Shortener Box - Inside Dashboard */}
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 rounded-3xl border border-neutral-800 shadow-xl relative">
          <div className="absolute -top-3 left-6 bg-neutral-800 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-neutral-700">
            🪄 Shorten New URL
          </div>
          
          <form onSubmit={handleShorten} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Destination URL</label>
              <input 
                type="url" 
                required 
                value={longUrl} 
                onChange={(e) => setLongUrl(e.target.value)} 
                placeholder="https://your-long-link.com" 
                className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Custom Alias (Optional)</label>
              <div className="flex bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition">
                <span className="bg-neutral-900 text-neutral-500 px-3 py-3 text-sm font-bold border-r border-neutral-800">/</span>
                <input 
                  type="text" 
                  value={alias} 
                  onChange={(e) => setAlias(e.target.value)} 
                  placeholder="my-custom-name" 
                  className="w-full bg-transparent text-white px-3 py-3 focus:outline-none text-sm"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 mt-2"
            >
              {loading ? "Generating..." : "Shorten Now ⚡"}
            </button>
          </form>

          {shortUrl && (
            <div className="mt-5 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-center backdrop-blur-sm">
              <p className="text-emerald-500 text-xs font-bold mb-2">Ready to share!</p>
              <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 text-sm font-medium truncate mr-2">{shortUrl}</span>
                <button 
                  onClick={() => {navigator.clipboard.writeText(shortUrl); alert("Copied!")}}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-md transition"
                >
                  📋
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
          }
                    
