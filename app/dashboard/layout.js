"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950 text-emerald-500">
        <p className="font-black text-xl animate-pulse">⚡ Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      
      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar / Slide Menu */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-neutral-950 p-1.5 rounded-lg text-lg leading-none font-black">⚡</span>
            <h1 className="text-lg font-black text-white tracking-wide">Click To Earn</h1>
          </div>
          <button onClick={() => setMenuOpen(false)} className="lg:hidden text-neutral-400 hover:text-white font-bold text-xl">✕</button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/20">
            <span>🏠</span> Dashboard
          </a>
          <a href="/dashboard/links" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl font-bold transition">
            <span>🔗</span> Link History
          </a>
          <a href="/dashboard/withdraw" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl font-bold transition">
            <span>💰</span> Withdraw Funds
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl font-bold transition">
            <span>📊</span> Analytics (Soon)
          </a>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition">
            <span>⏻</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        {/* Mobile Header with Hamburger */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
          <button onClick={() => setMenuOpen(true)} className="text-neutral-300 p-1">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div className="font-black text-white text-lg">LG Click To Earn</div>
          <div className="w-7 h-7"></div> {/* Spacer for centering */}
        </header>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
        }
        
