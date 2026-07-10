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
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email, cpm: 5.00, totalEarnings: 0, totalClicks: 0, walletBalance: 0, status: "active"
        });
      }
      router.push("/dashboard");
    } catch (error) { alert(error.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
      <div className="bg-[#131722] border border-[#1f2937] p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2 text-center">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          {isLogin ? "Login to your account" : "Join us and start earning"}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] text-white p-3 rounded-lg focus:border-purple-500 outline-none" required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] text-white p-3 rounded-lg focus:border-purple-500 outline-none" required />
          
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">
            {loading ? "Processing..." : isLogin ? "LOGIN" : "SIGN UP"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 font-bold underline">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
