"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [history] = useState([]); // Khali array (No history)

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] font-black text-lg uppercase">Withdraw Funds</header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* ... (Withdrawal Form same rahega) ... */}
        
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-500">Withdrawal History</p>
          {history.length === 0 ? (
            <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center text-gray-500 text-xs font-bold uppercase">
              No withdrawal history yet.
            </div>
          ) : (
             // History yahan map hogi
             history.map(item => (...))
          )}
        </div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}
