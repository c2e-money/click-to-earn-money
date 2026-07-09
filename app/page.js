"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;
    setLoading(true);
    
    const shortCode = Math.random().toString(36).substring(2, 8);
    try {
      await addDoc(collection(db, "urls"), {
        originalUrl: longUrl,
        code: shortCode,
        clicks: 0,
        userId: "guest_user", 
        createdAt: new Date(),
      });
      setShortUrl(window.location.origin + "/" + shortCode);
    } catch (error) {
      alert("Error generating link!");
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Shorten Your Link</h1>
        <p className="text-slate-500 text-sm mb-6">Create trackable links for LG Network.</p>
        
        <form onSubmit={handleShorten} className="flex flex-col gap-4">
          <input
            type="url"
            placeholder="Paste long URL here..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition shadow-md disabled:opacity-50"
          >
            {loading ? "Generating..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-800 font-semibold text-sm mb-2">Your Short Link is Ready:</p>
            <a href={shortUrl} target="_blank" className="text-blue-600 font-black text-lg underline break-all">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
