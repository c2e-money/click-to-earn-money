"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Settings() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleUpdate = () => {
    if (current !== "LG_SECRET") return alert("Current password valid nahi hai!");
    alert("Password updated!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Settings</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <input type="password" placeholder="Current Password" onChange={(e) => setCurrent(e.target.value)} className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <input type="password" placeholder="New Password" onChange={(e) => setNewPass(e.target.value)} className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937]" />
        <button onClick={handleUpdate} className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase">Update Password</button>
        <button className="w-full bg-red-900/30 text-red-500 p-4 rounded-xl border border-red-900 text-xs font-black uppercase mt-4">Logout</button>
      </main>
      <Navbar active="settings" />
    </div>
  );
}
