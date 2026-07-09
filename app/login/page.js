"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
        alert("Welcome back to LG Network!");
      } else {
        // Sign Up Logic
        await createUserWithEmailAndPassword(auth, email, password);
        alert("LG Network Account Created Successfully!");
      }
      
      // Successful login/signup ke baad seedha dashboard par bhej do
      router.push("/dashboard");
      
    } catch (error) {
      alert("Error: " + error.message); // Firebase error (e.g. wrong password) dikhayega
    }
    
    setLoading(false);
  };

  return (
    <div className="mt-12 flex flex-col items-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-blue-700 mb-2 text-center">
          {isLogin ? "Welcome Back" : "Join LG Network"}
        </h1>
        <p className="text-slate-500 text-sm mb-8 text-center">
          {isLogin ? "Login to manage your links & earnings." : "Create an account to start earning."}
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl font-extrabold text-lg transition shadow-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Secure Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-600 font-bold text-sm hover:text-blue-700 transition"
          >
            {isLogin ? "New to LG Network? Sign up here" : "Already have an account? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
                }
            
