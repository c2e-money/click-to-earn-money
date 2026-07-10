"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    // Ye credentials sirf tumhare paas hain
    if (email === "dipen8717@gmail.com" && password === "Dipen&Biswas9101") {
      setIsAdmin(true);
    } else {
      alert("Unauthorized Access!");
    }
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#0b0e14] flex items-center justify-center p-6">
        <div className="bg-[#131722] p-8 rounded-2xl border border-[#1f2937] w-full max-w-sm">
          <h1 className="text-xl font-black mb-6">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl mb-3 border border-[#1f2937]" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl mb-4 border border-[#1f2937]" />
          <button onClick={handleLogin} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Login</button>
        </div>
      </div>
    );
  }

  return (
    // Yahan tumhara pura Admin Panel ka code aayega jo maine pehle diya tha
    <div className="p-6 bg-[#0b0e14] text-white min-h-screen">
      <h1>Welcome Admin, LG Boss!</h1>
      {/* Admin stats and buttons go here */}
    </div>
  );
}
