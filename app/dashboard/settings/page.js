"use client";
import { useState } from "react";
import { Home, Link2, Wallet, Settings } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: "", new: "" });

  const handleUpdatePassword = () => {
    if (!passwords.current) return alert("Current password daalo!");
    alert("Password update process started...");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white overflow-hidden">
      <header className="p-4 border-b border-[#1f2937] font-black uppercase text-lg">Account Settings</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Password Change */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400">Change Password</p>
          <input type="password" placeholder="Current Password" onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] text-sm" />
          <input type="password" placeholder="New Password" onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] text-sm" />
          <button onClick={handleUpdatePassword} className="w-full bg-purple-600 p-3 rounded-lg font-black text-xs uppercase">Update Password</button>
        </div>

        {/* Contact Support */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400">Contact Support</p>
          <a href="https://wa.me/918811896374" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-sm font-bold text-emerald-400">WhatsApp Support</a>
          <a href="https://t.me/LG_OWNERZ" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-sm font-bold text-blue-400">Telegram Support</a>
          <a href="mailto:mrdipenff@gmail.com" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-sm font-bold text-red-400">Email Support</a>
        </div>
      </main>

      {/* Navbar Fix: Har page par ye same code use karna */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-4 flex justify-around z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-600"><Home size={20} /><span className="text-[10px] font-black uppercase mt-1">Home</span></Link>
        <Link href="/dashboard/links" className="flex flex-col items-center text-gray-600"><Link2 size={20} /><span className="text-[10px] font-black uppercase mt-1">Links</span></Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-600"><Wallet size={20} /><span className="text-[10px] font-black uppercase mt-1">Withdraw</span></Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center text-purple-500"><Settings size={20} /><span className="text-[10px] font-black uppercase mt-1">Settings</span></Link>
      </nav>
    </div>
  );
        }
        
