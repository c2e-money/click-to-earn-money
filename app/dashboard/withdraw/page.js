"use client";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Withdraw Funds</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
            <p className="text-[10px] text-gray-500 font-bold uppercase">Available Balance</p>
            <p className="text-2xl font-black text-emerald-400 mb-4">$0.00</p>
            <input type="number" placeholder="Enter Amount" className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] mb-3" />
            <button className="w-full bg-emerald-600 p-3 rounded-lg font-black text-xs uppercase">Withdraw Now</button>
        </div>
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center text-gray-500 text-xs font-bold uppercase">No withdrawal history</div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
