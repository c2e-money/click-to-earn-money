"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Settings() {
  const [current, setCurrent] = useState("");
  
  const handleUpdate = () => {
    if (current !== "LG_SECRET") {
      return alert("Error: Current password valid nahi hai!");
    }
    alert("Password updated!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg">SETTINGS</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <input type="password" placeholder="Current Password" onChange={(e) => setCurrent(e.target.value)} className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <input type="password" placeholder="New Password" className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <button onClick={handleUpdate} className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase">Update Password</button>
        
        <div className="space-y-2 pt-6">
          <a href="https://wa.me/918811896374" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937]">WhatsApp Support</a>
          <a href="https://t.me/LG_OWNERZ" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937]">Telegram Support</a>
          <a href="mailto:mrdipenff@gmail.com" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937]">Email Support</a>
        </div>
      </main>
      <Navbar active="settings" />
    </div>
  );
}
