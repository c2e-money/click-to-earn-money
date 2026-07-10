"use client";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg">WITHDRAW</header>
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <p className="text-gray-400">No withdrawal history yet.</p>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
