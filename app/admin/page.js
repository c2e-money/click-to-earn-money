"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    const settingsSnap = await getDoc(doc(db, "settings", "global"));
    if (settingsSnap.exists()) setGlobalCpm(settingsSnap.data().cpm);
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleLogin = () => {
    if (email === "admin@c2e.com" && password === "admin123") setIsAdmin(true);
    else alert("Unauthorized!");
  };

  const updateGlobalCpm = async () => {
    await setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) });
    alert("Global CPM updated!");
  };

  const addBonus = async (uid) => {
    await updateDoc(doc(db, "users", uid), { walletBalance: increment(1) });
    fetchData();
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#050608] flex items-center justify-center p-6">
        <div className="bg-[#0b0e14] p-8 rounded-3xl border border-[#1f2937] w-full max-w-sm text-white">
          <h1 className="text-xl font-black mb-6 text-center">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937]" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937]" />
          <button onClick={handleLogin} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Access Panel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050608] text-white min-h-screen p-4 pb-20">
      <h1 className="text-xl font-black uppercase italic mb-6 text-purple-500 text-center">CONTROL PANEL</h1>
      <div className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937] mb-6">
        <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Global CPM ($)</p>
        <div className="flex gap-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937]" />
            <button onClick={updateGlobalCpm} className="bg-purple-600 px-6 rounded-xl font-black uppercase text-[10px]">Update</button>
        </div>
      </div>
      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="bg-[#0b0e14] p-5 rounded-3xl border border-[#1f2937]">
            <p className="text-[11px] font-bold mb-1">{u.email}</p>
            <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold">Wallet: ${u.walletBalance?.toFixed(2) || "0.00"}</span>
                <button onClick={() => addBonus(u.id)} className="bg-blue-600 px-3 py-1 rounded font-black uppercase text-[9px]">+ $1 Bonus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
