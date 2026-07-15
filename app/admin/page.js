"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editVal, setEditVal] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) return;
    getDoc(doc(db, "settings", "global")).then(s => s.exists() && setGlobalCpm(s.data().cpm));
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [isAdmin]);

  const updateUserData = async (uid, field, value) => {
    await updateDoc(doc(db, "users", uid), { [field]: value });
    alert("Updated!");
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#050608] flex items-center justify-center p-6 text-white">
        <div className="bg-[#0b0e14] p-8 rounded-3xl border border-[#1f2937] w-full max-w-sm">
          <h1 className="text-xl font-black mb-6 text-center text-purple-500">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937]" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937]" />
          <button onClick={() => email === "admin@c2e.com" && password === "admin123" ? setIsAdmin(true) : alert("No!")} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Access</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#050608] min-h-screen text-white pb-20">
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Master Control Center</h1>
      
      {/* 1. Global CPM */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-purple-500 mb-6">
          <p className="text-[10px] font-black text-purple-300">GLOBAL CPM</p>
          <div className="flex gap-2 mt-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="bg-black p-2 rounded w-full text-sm font-black"/>
            <button onClick={() => setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) })} className="bg-purple-600 px-4 rounded font-black text-[10px]">SAVE</button>
          </div>
      </div>

      <button onClick={() => router.push('/admin/withdrawals')} className="w-full bg-blue-900 py-4 rounded-xl font-black text-xs uppercase mb-6">View Withdrawal Center</button>

      {/* 2. User List */}
      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <div className="flex justify-between items-center mb-2">
             <p className="text-[10px] font-black text-emerald-400 uppercase">{u.email}</p>
             <p className="text-[9px] text-gray-500">Joined: {u.createdAt?.toDate().toLocaleDateString() || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder={`Bal: ${u.walletBalance?.toFixed(2)}`} onChange={(e) => setEditVal({...editVal, [`bal_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "walletBalance", parseFloat(editVal[`bal_${u.id}`]))} className="bg-blue-600 rounded text-[9px] font-black">EDIT BAL</button>
              <input type="number" placeholder={`CPM: ${u.personalCpm || "Default"}`} onChange={(e) => setEditVal({...editVal, [`cpm_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "personalCpm", parseFloat(editVal[`cpm_${u.id}`]))} className="bg-orange-600 rounded text-[9px] font-black">EDIT CPM</button>
          </div>
        </div>
      ))}
    </div>
  );
      }
      
