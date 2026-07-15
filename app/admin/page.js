"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const updateStatus = async (uid, index, newStatus) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    let withdrawals = snap.data().withdrawals;
    withdrawals[index].status = newStatus;
    await updateDoc(userRef, { withdrawals: withdrawals });
    fetchData();
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#050608] flex items-center justify-center p-6">
        <div className="bg-[#0b0e14] p-8 rounded-3xl border border-[#1f2937] w-full max-w-sm text-white">
          <h1 className="text-xl font-black mb-6 text-center">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937]" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937]" />
          <button onClick={() => email === "admin@c2e.com" && password === "admin123" ? setIsAdmin(true) : alert("No!")} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050608] text-white min-h-screen p-4 pb-20">
      <h1 className="text-xl font-black uppercase text-center mb-6 text-purple-500">PAYOUT REQUESTS</h1>
      {users.map(u => u.withdrawals?.map((w, i) => (
        <div key={i} className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937] mb-3">
          <p className="text-xs font-bold">{u.email}</p>
          <p className="text-sm font-black text-emerald-400">${w.amount} via {w.method}</p>
          <div className="text-[10px] text-gray-500">
            {Object.entries(w.details).map(([k, v]) => <p key={k}>{k}: {v}</p>)}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => updateStatus(u.id, i, 'Paid')} className="bg-emerald-600 px-3 py-1 rounded text-[9px] font-black">Approve</button>
            <button onClick={() => updateStatus(u.id, i, 'Rejected')} className="bg-red-600 px-3 py-1 rounded text-[9px] font-black">Reject</button>
          </div>
        </div>
      )))}
    </div>
  );
        }
                                           
