"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), { 
            email: email, 
            walletBalance: 0.00, 
            earnings: 0.00,
            totalWithdrawn: 0.00, // NAYA: Total withdrawn zero se shuru
            clicks: 0,
            dailyClicks: {}
        });
      }
      router.push("/dashboard");
    } catch (err) { 
      alert(err.message); 
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] flex flex-col justify-center p-6 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">CLICK TO EARN</h1>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Professional Account Access</p>
      </div>

      <div className="bg-[#131722] p-8 rounded-3xl border border-[#1f2937] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
        <h2 className="text-lg font-black mb-6 uppercase text-white">{isLogin ? "Sign In" : "Create Account"}</h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Email Address</label>
            <input type="email" required onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 bg-[#0b0e14] border border-[#1f2937] p-4 rounded-xl text-white outline-none focus:border-purple-500 transition" placeholder="name@example.com" />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Password</label>
            <input type="password" required onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 bg-[#0b0e14] border border-[#1f2937] p-4 rounded-xl text-white outline-none focus:border-purple-500 transition" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-transform mt-4">
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="text-center text-[11px] font-bold text-gray-500 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 underline uppercase italic">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </main>
  );
}
