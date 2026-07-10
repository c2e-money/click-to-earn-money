"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [cpm, setCpm] = useState(5.00);

  const handleLogin = () => {
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAdmin(true);
      fetchUsers();
    } else {
      alert("Unauthorized!");
    }
  };

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Login Screen
  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#0b0e14] flex items-center justify-center p-6">
        <div className="bg-[#131722] p-8 rounded-2xl border border-[#1f2937] w-full max-w-sm">
          <h1 className="text-xl font-black mb-6 text-white">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl mb-3 border border-[#1f2937] text-white" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl mb-4 border border-[#1f2937] text-white" />
          <button onClick={handleLogin} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase text-white">Login</button>
        </div>
      </div>
    );
  }

  // Full Control Panel
  return (
    <div className="p-6 bg-[#0b0e14] text-white min-h-screen">
      <h1 className="text-2xl font-black uppercase italic mb-8">LG CONTROL PANEL</h1>
      
      {/* CPM Control */}
      <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] mb-6">
        <h2 className="text-xs font-black uppercase text-gray-500 mb-4">Global CPM Settings</h2>
        <div className="flex gap-4">
            <input type="number" value={cpm} onChange={(e) => setCpm(e.target.value)} className="bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] w-full" />
            <button className="bg-purple-600 px-6 py-3 rounded-xl font-black uppercase">Update</button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
        <h2 className="text-xs font-black uppercase text-gray-500 mb-4">Registered Users</h2>
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center border-b border-[#1f2937] pb-4">
                <div>
                    <p className="font-bold">{u.email || "User"}</p>
                    <p className="text-[10px] text-gray-500">Balance: ${u.walletBalance?.toFixed(2) || "0.00"}</p>
                </div>
                <button className="bg-emerald-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Approve</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }
    
