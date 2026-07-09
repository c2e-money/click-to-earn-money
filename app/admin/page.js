"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Yahan aap apna secret Admin Email aur Password set kar sakte hain
    if (email === "admin@lgnetwork.com" && password === "LgAdmin@2026") {
      // LocalStorage ek basic temporary security hai. 
      // Real backend mein ise Firebase session cookies se lock karna hoga.
      localStorage.setItem("lg_admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Wrong Credentials! Access Denied.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 border-red-600">
        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">🔐 LG Admin Access</h1>
        <input 
          type="email" placeholder="Admin Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500" required 
        />
        <input 
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500" required 
        />
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition">
          Login to Control Panel
        </button>
      </form>
    </div>
  );
            }

