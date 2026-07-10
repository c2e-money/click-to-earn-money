"use client";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();

  return (
    <div className="text-white max-w-7xl mx-auto px-6 py-10">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-20">
        <div className="text-xl font-black tracking-tighter">CLICK TO EARN</div>
        <div className="flex gap-6 text-sm font-bold">
          <button onClick={() => router.push("/login")} className="hover:text-purple-400">LOGIN</button>
          <button onClick={() => router.push("/login")} className="bg-purple-600 px-5 py-2 rounded-lg">SIGN UP</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h1 className="text-6xl font-black mb-6 leading-tight">
            Shorten Links. <br />
            <span className="text-purple-500">Share & Earn Money</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">Join the highest payout platform. Instant withdrawals & advanced analytics.</p>
          <button onClick={() => router.push("/login")} className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 rounded-xl font-black text-lg">
            GET STARTED
          </button>
        </div>

        {/* Mockup Card */}
        <div className="w-full md:w-1/3 bg-[#131722] border border-[#1f2937] p-8 rounded-3xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">Your Earnings</p>
          <p className="text-4xl font-black text-white">$ 12,875.60</p>
          <div className="mt-6 h-24 bg-purple-900/20 rounded-xl border border-purple-500/20"></div>
        </div>
      </section>
    </div>
  );
}
