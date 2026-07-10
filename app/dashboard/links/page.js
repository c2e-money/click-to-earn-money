"use client";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg">MY LINKS</header>
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <p className="text-gray-400">No links generated yet.</p>
      </main>
      <Navbar active="links" />
    </div>
  );
}
