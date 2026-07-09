"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function AdminLivePanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Live Users Fetching
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let usersList = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    });
    return () => unsub();
  }, []);

  const updateCPM = async (userId, newCpm) => {
    const cpmValue = parseFloat(newCpm);
    if (!cpmValue) return;
    await updateDoc(doc(db, "users", userId), { cpm: cpmValue });
    alert("⚡ CPM Updated Live!");
  };

  const toggleBan = async (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    await updateDoc(doc(db, "users", userId), { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-4 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-neutral-950 p-2 rounded-xl text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            ⚙️
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Master Admin</h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mt-1">Live Control Center</p>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-xl flex gap-4 shadow-lg">
          <div className="text-center">
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-black text-white">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-950/50 border-b border-neutral-800">
              <tr>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-wider">Publisher Details</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-wider">Performance</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-wider">Set CPM ($)</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-wider text-right">Action / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-800/30 transition duration-200">
                  <td className="p-5">
                    <p className="font-bold text-white text-sm">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${user.status === "banned" ? "bg-red-500" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`}></span>
                      <p className="text-xs font-bold text-neutral-500 uppercase">{user.status || "active"}</p>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-lg font-black text-emerald-400">${user.walletBalance?.toFixed(4) || "0.0000"}</p>
                    <p className="text-xs font-bold text-neutral-500 mt-1">{user.totalClicks || 0} Valid Clicks</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-500 font-bold text-sm">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          defaultValue={user.cpm} 
                          id={`cpm-${user.id}`}
                          className="w-24 bg-neutral-950 border border-neutral-800 text-white pl-7 pr-3 py-2 rounded-lg text-sm font-bold focus:outline-none focus:border-emerald-500 transition" 
                        />
                      </div>
                      <button 
                        onClick={() => updateCPM(user.id, document.getElementById(`cpm-${user.id}`).value)}
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-neutral-950 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => toggleBan(user.id, user.status)}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition border ${
                        user.status === "banned" 
                        ? "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-white" 
                        : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {user.status === "banned" ? "Unban Account" : "Ban Account"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-10 text-center text-neutral-500 font-bold">
            No users found in the system yet.
          </div>
        )}
      </div>
    </div>
  );
  }
                        
