import React, { useState } from "react";
import { Link2, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { signUpUser, logInUser } from "../lib/firebaseService";

interface AuthScreensProps {
  onAuthSuccess: (user: any) => void;
}

export default function AuthScreens({ onAuthSuccess }: AuthScreensProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill out all credential inputs.");
      return;
    }

    setLoading(true);

    try {
      const user = isLogin 
        ? await logInUser(email, password)
        : await signUpUser(email, password);

      // Store in simple localStorage for persistent session
      localStorage.setItem("click_user", JSON.stringify(user));
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "An unexpected security network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = (role: "user" | "admin") => {
    setEmail(role === "admin" ? "dipen8717@gmail.com" : "user@clicktoearn.com");
    setPassword(role === "admin" ? "Dipen&Biswas 9101" : "userpassword");
    setIsLogin(true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto" id="auth-viewport">
      
      {/* Brand Launcher Logo */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20 mb-3 border border-indigo-400/20 select-none">
          <Link2 className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight font-display">
          Click To Earn
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          The ultimate high-yield mobile link shortener with custom unskippable monetization loops.
        </p>
        
        {/* High-Conversion Badges (Lalach Elements) */}
        <div className="flex flex-col gap-1.5 pt-2 max-w-xs mx-auto text-left">
          <div className="flex items-center gap-2 bg-[#131a2e] border border-slate-800/80 px-3 py-1.5 rounded-xl">
            <span className="text-sm">💰</span>
            <span className="text-[10px] text-slate-300 font-bold">Minimum Payout: <span className="text-emerald-400 font-extrabold">Only $2</span></span>
          </div>
          <div className="flex items-center gap-2 bg-[#131a2e] border border-slate-800/80 px-3 py-1.5 rounded-xl">
            <span className="text-sm">⚡</span>
            <span className="text-[10px] text-slate-300 font-bold">Instant Payouts <span className="text-indigo-400 font-extrabold">(Google Pay / PhonePe)</span></span>
          </div>
          <div className="flex items-center gap-2 bg-[#131a2e] border border-slate-800/80 px-3 py-1.5 rounded-xl">
            <span className="text-sm">📈</span>
            <span className="text-[10px] text-slate-300 font-bold">Highest Industry <span className="text-amber-400 font-extrabold">CPM Guarantee</span></span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="w-full bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex justify-between items-center select-none border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {isLogin ? "Authenticate Desk" : "Create Operator Desk"}
          </h2>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-all underline"
          >
            {isLogin ? "Join Partner" : "Have Account?"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Operator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="partner@clicktoearn.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                id="email-input"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                id="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-all"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-xl text-xs flex gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating Security...
              </>
            ) : (
              <>
                {isLogin ? "LOG IN TO DASHBOARD" : "REGISTER PARTNER DESK"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Clean, simple screen */}
      </div>

      {/* Dynamic Stats Banner (Lalach Elements) */}
      <div className="w-full text-center mt-4 select-none">
        <p className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2 px-4 shadow-md inline-block animate-pulse">
          🔥 Over $12,450+ paid out to users this week alone!
        </p>
      </div>

    </div>
  );
}
