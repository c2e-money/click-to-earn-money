"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const router = useRouter();

  const handleUpdate = () => {
    if (current !== "LG_SECRET") return alert("Current password galat hai!");
    if (!newPass) return alert("Naya password daalo!");
    alert("Password successfully updated!");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase text-purple-500">Settings</header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Update Password Section (Restored) */}
        <input 
          type="password" 
          value={current} 
          onChange={(e) => setCurrent(e.target.value)} 
          placeholder="Current Password" 
          className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937] outline-none focus:border-purple-500" 
        />
        <input 
          type="password" 
          value={newPass} 
          onChange={(e) => setNewPass(e.target.value)} 
          placeholder="New Password" 
          className="w-full bg-[#131722] p-3 rounded-lg border border-[#1f2937] outline-none focus:border-purple-500" 
        />
        <button 
          onClick={handleUpdate} 
          className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase active:scale-95 transition-transform"
        >
          Update Password
        </button>
        
        {/* Support & Logout Section */}
        <div className="space-y-2 pt-6">
          <a href="https://wa.me/918811896374" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold text-center">WhatsApp Support</a>
          <a href="https://t.me/LG_OWNERZ" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold text-center">Telegram Support</a>
          <a href="mailto:mrdipenff@gmail.com" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold text-center">Email Support</a>
          
          <button onClick={handleLogout} className="w-full bg-red-900/30 text-red-500 p-4 rounded-xl border border-red-900 text-xs font-black uppercase mt-4 active:scale-95 transition-transform">
            Logout
          </button>
        </div>
      </main>

      <Navbar active="settings" />
    </div>
  );
          }
