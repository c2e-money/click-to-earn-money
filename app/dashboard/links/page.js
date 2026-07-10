"use client";
import Navbar from "../../components/Navbar"; // Navbar import kar rahe hain

export default function LinksHistory() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans">
      {/* Header */}
      <header className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <h1 className="text-lg font-black italic uppercase">MY LINKS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Tumhara purana design */}
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center">
            <p className="text-xs text-gray-500 font-bold uppercase">No links generated yet.</p>
        </div>
      </main>

      {/* Navigation */}
      <Navbar />
    </div>
  );
}
