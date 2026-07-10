"use client";
import Navbar from "@/app/components/Navbar";

export default function Settings() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Settings</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="space-y-2">
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
