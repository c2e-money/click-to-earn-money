"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="bg-[#0b0e14] text-white min-h-screen pb-24 font-sans selection:bg-purple-500/30">
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border-b border-[#1f2937] px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-gray-300 tracking-wider uppercase">4,892 Users Online</span>
        </div>
        <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">FAST PAY</span>
      </div>

      <div className="p-6 pt-8 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
          CLICK TO EARN
        </h1>
        <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mt-1">The Highest Paying URL Shortener</p>

        <div className="mt-6 bg-[#131722] p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-[#0b0e14] text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">Active Pool</div>
          <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Top Earner This Week</p>
          <p className="text-5xl font-black text-white my-2 tracking-tight">$5,240.00</p>
          <p className="text-emerald-400 font-bold text-xs">📈 Daily Growth Rate +14.8%</p>
        </div>
      </div>

      <div className="px-6 mb-8">
        <button onClick={() => router.push('/login')} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 py-4 rounded-2xl font-black text-base shadow-xl shadow-green-900/20 active:scale-[0.98] transition-transform">
          CREATE ACCOUNT & CLAIM $1 BONUS
        </button>
      </div>

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Highest CPM</p>
            <p className="text-xl font-black text-emerald-400 mt-1">$12.50</p>
          </div>
          <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Exchange Rate</p>
            <p className="text-xl font-black text-purple-400 mt-1">1 USD = 84 INR</p>
          </div>
        </div>

        <div className="bg-[#131722] rounded-2xl border border-[#1f2937] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1f2937] text-[9px] font-black text-gray-500 uppercase tracking-widest">Payout Rates Per 1000 Views</div>
          <div className="divide-y divide-[#1f2937]/60 text-xs">
            {['United States: $12.50', 'United Kingdom: $10.00', 'India: $4.50'].map((item, i) => (
              <div key={i} className="px-4 py-3 flex justify-between">
                <span className="font-bold">{item.split(':')[0]}</span>
                <span className="font-black text-emerald-500">{item.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#131722]/90 backdrop-blur-xl border-t border-[#1f2937] p-4 flex gap-4 items-center z-50">
        <div className="flex-1">
          <p className="text-[8px] text-gray-400 font-bold uppercase">Start Earning Today</p>
          <p className="text-sm font-black text-emerald-400">No Complex Approval</p>
        </div>
        <button onClick={() => router.push('/login')} className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-purple-900/30">
          SIGN UP
        </button>
      </div>
    </main>
  );
    }
