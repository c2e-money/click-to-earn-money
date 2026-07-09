"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-5 flex justify-between items-center border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-neutral-950 p-1.5 rounded-lg text-lg font-black leading-none">⚡</span>
          <span className="text-xl font-black text-white tracking-widest">LG NETWORK</span>
        </div>
        <button 
          onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition border border-neutral-700"
        >
          {isLoggedIn ? "Dashboard" : "Login"}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 mt-10">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-6">
          The Ultimate Click To Earn Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl">
          Shorten Links. <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Earn Money.
          </span>
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mb-10 font-medium leading-relaxed">
          Highest CPM rates, detailed analytics, and instant withdrawals. Turn your traffic into real cash with our premium shortening engine.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
            className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-8 py-4 rounded-xl font-black text-lg transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            Start Earning Now ➔
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-white font-black text-lg mb-2">High CPM Rates</h3>
            <p className="text-neutral-500 text-sm">We offer the most competitive rates in the market to ensure you maximize your revenue.</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-white font-black text-lg mb-2">Instant Payouts</h3>
            <p className="text-neutral-500 text-sm">Request withdrawals anytime once you hit the minimum limit. Fast and secure.</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-white font-black text-lg mb-2">Real-Time Stats</h3>
            <p className="text-neutral-500 text-sm">Track every click, location, and device with our advanced live analytics dashboard.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-20 py-8 text-center text-neutral-600 text-sm relative z-10">
        <p>© 2026 LG Click To Earn. All rights reserved.</p>
      </footer>
    </div>
  );
        }
