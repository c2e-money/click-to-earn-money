"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editVal, setEditVal] = useState({});

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const updateStatus = async (uid, index, newStatus) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    let withdrawals = snap.data().withdrawals;
    withdrawals[index].status = newStatus;
    await updateDoc(userRef, { withdrawals: withdrawals });
    fetchData();
  };

  const updatePersonalCpm = async (uid, newCpm) => {
    await updateDoc(doc(db, "users", uid), { personalCpm: parseFloat(newCpm) });
    fetchData(); alert("CPM Updated!");
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
    <div className="p-4 bg-[#050608] min-h-screen text-white">
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Master Panel</h1>
      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <p className="text-xs font-bold mb-2">{u.email}</p>
          <div className="flex gap-2 mb-4">
            <input type="number" placeholder={u.personalCpm || "Set CPM"} onChange={(e) => setEditVal({...editVal, [u.id]: e.target.value})} className="bg-black p-1 text-xs w-20"/>
            <button onClick={() => updatePersonalCpm(u.id, editVal[u.id])} className="bg-orange-600 px-2 text-[9px] font-black">EDIT CPM</button>
          </div>
          {u.withdrawals?.map((w, i) => (
            <div key={i} className="bg-black p-2 mt-1 rounded flex justify-between items-center text-[10px]">
              <span>{w.id} - ${w.amount} ({w.status})</span>
              <div className="flex gap-1">
                <button onClick={() => updateStatus(u.id, i, 'Paid')} className="bg-emerald-700 px-1 rounded">✔</button>
                <button onClick={() => updateStatus(u.id, i, 'Rejected')} className="bg-red-700 px-1 rounded">✖</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
