"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Settings() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleUpdate = () => {
    // Current Password check: agar "LG_SECRET" match karta hai, tabhi change hoga
    if (current !== "LG_SECRET") return alert("Current password galat hai!");
    if (!newPass) return alert("Naya password daalo!");
    alert("Password successfully updated!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Settings</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current Password" className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <button onClick={handleUpdate} className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase">Update Password</button>
        <div className="space-y-2 pt-6">
          <a href="https://wa.me/918811896374" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold">WhatsApp Support</a>
          <a href="https://t.me/LG_OWNERZ" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold">Telegram Support</a>
          <a href="mailto:mrdipenff@gmail.com" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold">Email Support</a>
          <button onClick={() => window.location.href = "/login"} className="w-full bg-red-900/30 text-red-500 p-4 rounded-xl border border-red-900 text-xs font-black uppercase mt-4">Logout</button>
        </div>
      </main>
      <Navbar active="settings" />
    </div>
  );
}
