"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-white">CLICK TO EARN</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-glass p-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Earnings</p>
          <p className="text-3xl font-black text-white mt-2">$1,250.75</p>
        </div>
        <div className="card-glass p-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Clicks</p>
          <p className="text-3xl font-black text-white mt-2">25.8M</p>
        </div>
        <div className="card-glass p-6">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Avg CPM</p>
          <p className="text-3xl font-black text-white mt-2">$4.25</p>
        </div>
      </div>

      {/* Shortener Box */}
      <div className="card-glass p-8">
        <h2 className="text-lg font-bold mb-4">Shorten Link</h2>
        <div className="flex gap-4">
          <input type="text" placeholder="Paste URL here..." className="flex-1 bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-white" />
          <button className="bg-purple-600 px-6 py-3 rounded-lg font-bold text-white">SHORTEN</button>
        </div>
      </div>
    </div>
  );
}
