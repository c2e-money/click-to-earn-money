"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Creating User Account in Database
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          cpm: 5.00,
          totalEarnings: 0,
          totalClicks: 0,
          walletBalance: 0,
          role: "publisher",
          status: "active",
          joinedAt: new Date()
        });
      }
      router.push("/dashboard");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-500 text-neutral-950 p-3 rounded-2xl text-3xl mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            ⚡
          </div>
          <h1 className="text-3xl font-black text-white tracking-wide">
            LG <span className="text-emerald-500">Click To Earn</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2 font-medium">
            {isLogin ? "Welcome back, Creator." : "Join the premium network today."}
          </p>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl p-8 rounded-3xl border border-neutral-800 shadow-2xl">
          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-neutral-500">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-neutral-500">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition font-medium"
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                <input type="checkbox" className="accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                Keep me logged in
              </label>
              {isLogin && (
                <a href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition">
                  Forgot Password?
                </a>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-6 py-4 rounded-xl font-black text-sm transition shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-50 mt-2 uppercase tracking-wider"
            >
              {loading ? "Processing..." : isLogin ? "Access Dashboard ➔" : "Create Account ➔"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral-500 text-sm">
              {isLogin ? "No account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-black hover:text-emerald-400 transition"
              >
                {isLogin ? "Get started" : "Login here"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Feature Tags */}
        {!isLogin && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-neutral-900/50 border border-neutral-800/50 p-3 rounded-xl text-center">
              <p className="text-emerald-500 text-lg mb-1">🛡️</p>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Highly Secure</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-800/50 p-3 rounded-xl text-center">
              <p className="text-emerald-500 text-lg mb-1">⚡</p>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Ultra Fast</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
                  
