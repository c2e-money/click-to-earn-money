"use client";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-black">🚀</div>
          <span className="font-black text-xl tracking-tight">CLICK TO EARN</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400">
          <a href="#" className="hover:text-purple-400 transition">Features</a>
          <a href="#" className="hover:text-purple-400 transition">Payout Rates</a>
          <a href="#" className="hover:text-purple-400 transition">Contact</a>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push("/login")} className="text-sm font-bold hover:text-purple-400">LOGIN</button>
          <button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg text-sm font-bold transition">SIGN UP</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-6xl font-black leading-tight mb-6">
            Shorten Links. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Share & Earn Money</span>
          </h1>
          <p className="text-gray-400 mb-8 text-lg">Join Click To Earn and start earning money for every valid click on your links. Highest payout rates and instant withdrawals.</p>
          <div className="flex gap-4">
            <button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl font-black transition shadow-lg shadow-purple-900/20">GET STARTED</button>
            <button className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl font-bold transition">LEARN MORE</button>
          </div>
        </div>

        {/* Earning Card (Visual) */}
        <div className="flex-1 bg-[#131722] border border-[#1f2937] p-8 rounded-3xl shadow-2xl relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 text-xs font-bold uppercase">Your Earnings</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">+23.5%</span>
          </div>
          <p className="text-5xl font-black mb-2">$ 12,875.60</p>
          <div className="h-32 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg border-b border-purple-500 mt-6"></div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-[#1f2937]">
        {[
          { title: "Total Users", val: "250K+" },
          { title: "Links Shortened", val: "1.2M+" },
          { title: "Total Clicks", val: "25M+" },
          { title: "Total Paid", val: "$1.8M+" }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-black">{item.val}</p>
            <p className="text-gray-500 text-xs font-bold uppercase mt-1">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
        }
