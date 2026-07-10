"use client";
import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Shortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    if (!longUrl) return;
    const code = Math.random().toString(36).substring(2, 8);
    await addDoc(collection(db, "urls"), {
      originalUrl: longUrl, code, userId: auth.currentUser.uid, clicks: 0, createdAt: serverTimestamp()
    });
    setShortUrl(`${window.location.origin}/${code}`);
  };

  return (
    <div className="bg-[#131722] border border-[#1f2937] p-6 rounded-2xl shadow-xl mt-6">
      <h3 className="text-white font-bold mb-4">Shorten Your Link</h3>
      <div className="flex gap-2">
        <input 
          type="url" 
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Paste your long URL here..." 
          className="flex-1 bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-white outline-none focus:border-purple-500" 
        />
        <button onClick={handleShorten} className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-lg font-bold text-white">
          SHORTEN
        </button>
      </div>
      {shortUrl && <p className="mt-4 text-emerald-400 font-bold bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937]">{shortUrl}</p>}
    </div>
  );
      }
  
