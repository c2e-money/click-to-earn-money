"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editVal, setEditVal] = useState({});

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    const settingsSnap = await getDoc(doc(db, "settings", "global"));
    if (settingsSnap.exists()) setGlobalCpm(settingsSnap.data().cpm);
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const updateGlobalCpm = async () => {
    await setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) });
    alert("Global CPM Updated!");
  };

  const updateUserData = async (uid, field, value) => {
    await updateDoc(doc(db, "users", uid), { [field]: value });
    fetchData(); alert("Updated!");
  };

  const updateWithdrawalStatus = async (uid, index, newStatus) => {
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
          <h1 className="text-xl font-black mb-6 text-center">ADMIN PANEL</h1>
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
      
      {/* Global CPM */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-purple-500 mb-6">
          <p className="text-[10px] uppercase font-black text-purple-300">Global CPM</p>
          <div className="flex gap-2 mt-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="bg-black p-2 rounded w-full text-sm font-black"/>
            <button onClick={updateGlobalCpm} className="bg-purple-600 px-4 rounded font-black text-xs uppercase">SAVE</button>
          </div>
      </div>

      {/* Users List */}
      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <div className="flex justify-between items-center mb-4">
            <p className={`text-xs font-bold ${u.isBanned ? 'text-red-500' : 'text-emerald-400'}`}>{u.email}</p>
            <button onClick={() => updateUserData(u.id, "isBanned", !u.isBanned)} className={`px-2 py-1 rounded text-[9px] font-black ${u.isBanned ? 'bg-green-700' : 'bg-red-700'}`}>
                {u.isBanned ? "UNBAN" : "BAN"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
              <input type="number" placeholder={`Bal: ${u.walletBalance}`} onChange={(e) => setEditVal({...editVal, [`bal_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "walletBalance", parseFloat(editVal[`bal_${u.id}`]))} className="bg-blue-600 rounded text-[9px] font-black">EDIT BAL</button>
              <input type="number" placeholder={`CPM: ${u.personalCpm || "Default"}`} onChange={(e) => setEditVal({...editVal, [`cpm_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "personalCpm", parseFloat(editVal[`cpm_${u.id}`]))} className="bg-orange-600 rounded text-[9px] font-black">EDIT CPM</button>
          </div>

          <p className="text-[10px] uppercase font-black text-gray-600 border-b border-[#1f2937] pb-1 mb-2">Withdrawals</p>
          {u.withdrawals?.map((w, i) => (
            <div key={i} className="bg-[#050608] p-3 rounded-lg mb-2 border border-[#1f2937]">
              <div className="flex justify-between text-[10px] font-black">
                <span>{w.id} - ${w.amount}</span>
                <span className={w.status === 'Paid' ? 'text-emerald-500' : 'text-yellow-500'}>{w.status}</span>
              </div>
              <div className="text-[9px] text-gray-400 font-mono mt-1">
                {Object.entries(w.details || {}).map(([k, v]) => <p key={k}>{k}: {v}</p>)}
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateWithdrawalStatus(u.id, i, 'Paid')} className="bg-emerald-700 flex-1 py-1 rounded text-[9px] font-black">APPROVE</button>
                <button onClick={() => updateWithdrawalStatus(u.id, i, 'Rejected')} className="bg-red-700 flex-1 py-1 rounded text-[9px] font-black">REJECT</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
        }
        
