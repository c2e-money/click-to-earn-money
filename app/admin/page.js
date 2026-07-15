"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00); // Global CPM State
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editVal, setEditVal] = useState({});

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    // Global CPM fetch karna
    const settingsSnap = await getDoc(doc(db, "settings", "global"));
    if (settingsSnap.exists()) setGlobalCpm(settingsSnap.data().cpm);
    
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const updateGlobalCpm = async () => {
    await setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) });
    alert("Global CPM updated successfully!");
    fetchData();
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
    if(!newCpm) return;
    await updateDoc(doc(db, "users", uid), { personalCpm: parseFloat(newCpm) });
    fetchData(); alert("Personal CPM Updated!");
  };

  const editUserBalance = async (uid, newBalance) => {
     if(!newBalance) return;
     await updateDoc(doc(db, "users", uid), { walletBalance: parseFloat(newBalance) });
     fetchData(); alert("Balance Updated!");
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
    <div className="p-4 bg-[#050608] min-h-screen text-white pb-20">
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Master Panel</h1>

      {/* GLOBAL CPM EDIT SECTION (TOP PAR) */}
      <div className="bg-[#1f2937] p-4 rounded-xl mb-6 border border-purple-500">
          <p className="text-[10px] font-black uppercase text-purple-300 mb-2">Global CPM Control</p>
          <div className="flex gap-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="bg-black p-2 rounded w-full text-sm font-black"/>
            <button onClick={updateGlobalCpm} className="bg-purple-600 px-4 rounded font-black text-xs uppercase">SAVE GLOBAL CPM</button>
          </div>
      </div>

      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <p className="text-xs font-bold mb-2 text-emerald-400">{u.email}</p>
          
          {/* EDIT BALANCE & PERSONAL CPM */}
          <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center bg-[#050608] p-2 rounded-lg border border-[#1f2937]">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Bal: ${u.walletBalance?.toFixed(2) || "0.00"}</span>
                  <div className="flex gap-2">
                      <input type="number" placeholder="New Bal" onChange={(e) => setEditVal({...editVal, [`bal_${u.id}`]: e.target.value})} className="bg-black p-1 text-xs w-16 rounded border border-gray-800 outline-none"/>
                      <button onClick={() => editUserBalance(u.id, editVal[`bal_${u.id}`])} className="bg-blue-600 px-2 rounded text-[9px] font-black">EDIT</button>
                  </div>
              </div>
              
              <div className="flex justify-between items-center bg-[#050608] p-2 rounded-lg border border-[#1f2937]">
                  <span className="text-[10px] text-gray-400 uppercase font-black">CPM: ${u.personalCpm || "Default"}</span>
                  <div className="flex gap-2">
                      <input type="number" placeholder="New CPM" onChange={(e) => setEditVal({...editVal, [`cpm_${u.id}`]: e.target.value})} className="bg-black p-1 text-xs w-16 rounded border border-gray-800 outline-none"/>
                      <button onClick={() => updatePersonalCpm(u.id, editVal[`cpm_${u.id}`])} className="bg-orange-600 px-2 rounded text-[9px] font-black">EDIT</button>
                  </div>
              </div>
          </div>

          {/* WITHDRAWALS */}
          <div className="space-y-2">
              <p className="text-[10px] uppercase font-black text-gray-600 border-b border-[#1f2937] pb-1">Withdrawals</p>
              {u.withdrawals?.length > 0 ? u.withdrawals.map((w, i) => (
                <div key={i} className="bg-[#050608] p-3 rounded-lg border border-[#1f2937]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-black text-white">${w.amount} <span className="text-gray-500 font-normal">({w.id})</span></span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${w.status === 'Paid' ? 'bg-emerald-900 text-emerald-400' : w.status === 'Rejected' ? 'bg-red-900 text-red-400' : 'bg-yellow-900 text-yellow-400'}`}>{w.status}</span>
                  </div>
                  <p className="text-[10px] text-purple-400 font-bold mb-1">{w.method}</p>
                  <div className="text-[9px] text-gray-400 mb-2 font-mono">
                    {Object.entries(w.details || {}).map(([k, v]) => <p key={k}>{k}: {v}</p>)}
                  </div>
                  {w.status === 'Pending' && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-[#1f2937]">
                        <button onClick={() => updateStatus(u.id, i, 'Paid')} className="bg-emerald-600 flex-1 py-1 rounded text-[10px] font-black">Approve</button>
                        <button onClick={() => updateStatus(u.id, i, 'Rejected')} className="bg-red-600 flex-1 py-1 rounded text-[10px] font-black">Reject</button>
                      </div>
                  )}
                </div>
              )) : <p className="text-[9px] text-gray-600 italic">No withdrawal requests.</p>}
          </div>
        </div>
      ))}
    </div>
  );
        }
            
