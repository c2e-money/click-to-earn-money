"use client";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg">C2E DASHBOARD</header>
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Yahan Stats aur Shortener ka code daalo */}
        <p className="text-gray-400">Home Content Here...</p>
      </main>
      <Navbar active="home" />
    </div>
  );
}
