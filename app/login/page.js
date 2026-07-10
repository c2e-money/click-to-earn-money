"use client";
import { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px]"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">CLICK TO EARN</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Professional URL Shortener</p>
        </div>

        <div className="bg-[#131722]/80 backdrop-blur-xl border border-[#1f2937] p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <form className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" className="w-full mt-2 bg-[#0b0e14] border border-[#1f2937] text-white p-4 rounded-xl outline-none focus:border-purple-500 transition" placeholder="name@company.com" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input type="password" className="w-full mt-2 bg-[#0b0e14] border border-[#1f2937] text-white p-4 rounded-xl outline-none focus:border-purple-500 transition" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl font-black text-white hover:opacity-90 transition-all shadow-lg shadow-purple-900/20">
              {isLogin ? "LOGIN" : "GET STARTED"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {isLogin ? "New here? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 font-bold underline decoration-purple-400/50">
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
