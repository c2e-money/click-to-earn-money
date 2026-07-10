"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, increment } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00);

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    // 1. Fetch Global CPM
    const settingsSnap = await getDoc(doc(db, "settings", "global"));
    if (settingsSnap.exists()) setGlobalCpm(settingsSnap.data().cpm);

    // 2. Fetch All Users
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Update Global CPM (Ye sabhi users pe effect karega)
  const updateGlobalCpm = async () => {
    await setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) });
    alert("Global CPM Updated for everyone!");
  };

  // Individual Balance Control
  const updateBalance = async (uid, amount, type) => {
    await updateDoc(doc(db, "users", uid), { 
        walletBalance: type === 'add' ? increment(amount) : increment(-amount) 
    });
    fetchData();
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen p-6 font-sans">
      {/* GLOBAL CONTROLS */}
      <div className="bg-[#0b0e14] p-6 rounded-3xl border border-[#1f2937] mb-8">
        <h2 className="text-xs font-black uppercase text-purple-500 mb-4 italic">Global CPM Settings</h2>
        <div className="flex gap-4">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl border border-[#1f2937]" />
            <button onClick={updateGlobalCpm} className="bg-purple-600 px-8 rounded-xl font-black uppercase text-xs hover:bg-purple-700">Apply To All</button>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-[#0b0e14] rounded-3xl border border-[#1f2937] overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-[#131722] text-[10px] uppercase font-black text-gray-400">
                <tr>
                    <th className="p-4">User Email</th>
                    <th className="p-4">Balance</th>
                    <th className="p-4 text-center">Controls</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937] text-[11px]">
                {users.map(u => (
                    <tr key={u.id}>
                        <td className="p-4 font-bold">{u.email}</td>
                        <td className="p-4 italic text-emerald-400">${u.walletBalance?.toFixed(2)}</td>
                        <td className="p-4 flex gap-2 justify-center">
                            <button onClick={() => updateBalance(u.id, 5, 'add')} className="bg-blue-600 px-3 py-1 rounded font-black">+</button>
                            <button onClick={() => updateBalance(u.id, 5, 'sub')} className="bg-red-600 px-3 py-1 rounded font-black">-</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
                  }
