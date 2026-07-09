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
        
        // Naye user ka khata (Account) database mein banana
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          cpm: 5.00, // Default CPM $5
          totalEarnings: 0,
          totalClicks: 0,
          walletBalance: 0,
          role: "publisher",
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
    <div className="mt-12 flex flex-col items-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-blue-700 mb-2 text-center">
          {isLogin ? "LG Network Login" : "Join LG Network"}
        </h1>
        <p className="text-slate-500 text-sm mb-8 text-center">
          {isLogin ? "Manage your links & earnings." : "Create an account to start earning."}
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (Min 6 char)" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600" required minLength="6" />
          <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white px-6 py-4 rounded-xl font-extrabold text-lg shadow-lg mt-2 disabled:opacity-50">
            {loading ? "Wait..." : isLogin ? "Secure Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center pt-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-slate-600 font-bold text-sm hover:text-blue-700">
            {isLogin ? "New here? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
          }
