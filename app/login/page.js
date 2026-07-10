"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), { email, walletBalance: 0 });
      }
      // Build fix: Simple location redirect
      window.location.href = "/dashboard"; 
    } catch (err) { alert(err.message); }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131722] p-8 rounded-2xl border border-[#1f2937]">
        <h1 className="text-2xl font-black text-white text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-white outline-none" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg text-white outline-none" />
          <button type="submit" className="w-full bg-purple-600 py-3 rounded-lg font-black">CONTINUE</button>
        </form>
      </div>
    </main>
  );
}
