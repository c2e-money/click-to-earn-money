"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editVal, setEditVal] = useState({});

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const updateStatus = async (uid, withdrawalIndex, newStatus) => {
    const user = users.find(u => u.id === uid);
    let updatedWithdrawals = [...user.withdrawals];
    updatedWithdrawals[withdrawalIndex].status = newStatus;
    await updateDoc(doc(db, "users", uid), { withdrawals: updatedWithdrawals });
    fetchData();
  };

  const editUserBalance = async (uid, newBalance) => {
    await updateDoc(doc(db, "users", uid), { walletBalance: parseFloat(newBalance) });
    fetchData();
  };

  return (
    <div className="p-4 bg-[#050608] min-h-screen text-white">
      <h1 className="text-center font-black text-purple-500 mb-6">ADMIN MASTER PANEL</h1>
      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <p className="text-xs font-bold">{u.email}</p>
          <div className="flex gap-2 my-2">
            <input type="number" placeholder={u.walletBalance} onChange={(e) => setEditVal({...editVal, [u.id]: e.target.value})} className="bg-black p-1 text-xs w-20"/>
            <button onClick={() => editUserBalance(u.id, editVal[u.id])} className="bg-blue-600 px-2 text-[9px] font-black">EDIT BALANCE</button>
          </div>
          
          {u.withdrawals?.map((w, i) => (
            <div key={i} className="bg-black p-2 mt-2 rounded flex justify-between items-center text-[10px]">
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
