"use client";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">My Links</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Create Link Section */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="text" placeholder="Paste URL..." className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] mb-2 text-sm" />
          <button className="w-full bg-purple-600 p-3 rounded-lg font-black text-xs uppercase">Generate Link</button>
        </div>
        {/* History List */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center py-10">
          <p className="text-xs text-gray-500 font-bold uppercase">No history found</p>
        </div>
      </main>
      <Navbar active="links" />
    </div>
  );
}
