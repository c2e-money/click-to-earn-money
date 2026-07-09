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
    if (!longUrl) return alert("Please enter a URL");

    setLoading(true);
    // 6 characters ka random short code generate karna
    const shortCode = Math.random().toString(36).substring(2, 8);

    try {
      await addDoc(collection(db, "urls"), {
        originalUrl: longUrl,
        code: shortCode,
        clicks: 0,
        userId: "guest_user", // Baad mein auth se replace hoga
        createdAt: new Date(),
      });

      const generatedLink = window.location.origin + "/" + shortCode;
      setShortUrl(generatedLink);
    } catch (error) {
      console.error("Error saving link:", error);
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div class="max-w-3xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-slate-100 text-center">
      <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Enter Long URL to Shorten</h1>
      <p class="text-slate-500 mb-6">Create clean, trackable links for your business network.</p>
      
      <form onSubmit={handleShorten} class="flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/very-long-link-details"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          class="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {shortUrl && (
        <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p class="text-green-800 font-medium mb-1">Your Shortened Business Link:</p>
          <a href={shortUrl} target="_blank" class="text-blue-600 font-bold text-xl hover:underline">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
            }
        
