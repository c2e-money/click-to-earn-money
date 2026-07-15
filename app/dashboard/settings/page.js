"use client";
import Navbar from "@/app/components/Navbar";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

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
        <div className="space-y-2 pt-2">
          <a href="https://wa.me/918811896374" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold text-center">WhatsApp Support</a>
          <a href="https://t.me/LG_OWNERZ" className="block bg-[#131722] p-4 rounded-xl border border-[#1f2937] text-xs font-bold text-center">Telegram Support</a>
          
          <button onClick={handleLogout} className="w-full bg-red-900/30 text-red-500 p-4 rounded-xl border border-red-900 text-xs font-black uppercase mt-6 active:scale-95 transition-transform">
            Logout Account
          </button>
        </div>
      </main>
      <Navbar active="settings" />
    </div>
  );
}
