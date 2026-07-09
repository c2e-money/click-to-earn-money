"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function AdminLivePanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Saare users ki list LIVE fetch karna
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let usersList = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    });
    return () => unsub();
  }, []);

  // User ka personal CPM Update karna
  const updateCPM = async (userId, newCpm) => {
    const cpmValue = parseFloat(newCpm);
    if (!cpmValue) return;
    await updateDoc(doc(db, "users", userId), { cpm: cpmValue });
    alert("CPM Live Updated!");
  };

  // User ko Ban ya Unban karna
  const toggleBan = async (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    await updateDoc(doc(db, "users", userId), { status: newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-6">
      <div className="bg-slate-900 text-white p-5 rounded-t-xl shadow flex justify-between items-center">
        <h2 className="text-xl font-black tracking-wider">⚙️ LG Network Master Admin</h2>
      </div>

      <div className="bg-white shadow-xl rounded-b-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200 text-sm">
            <tr>
              <th className="p-4 font-bold text-slate-600">Email</th>
              <th className="p-4 font-bold text-slate-600">Wallet</th>
              <th className="p-4 font-bold text-slate-600">Set CPM ($)</th>
              <th className="p-4 font-bold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{user.email}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">Clicks: {user.totalClicks || 0}</p>
                </td>
                <td className="p-4 font-black text-green-600">${user.walletBalance?.toFixed(4) || "0.0000"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      defaultValue={user.cpm} 
                      id={`cpm-${user.id}`}
                      className="border border-slate-300 rounded px-2 py-1 w-20 text-sm font-bold outline-none focus:border-blue-500" 
                    />
                    <button 
                      onClick={() => updateCPM(user.id, document.getElementById(`cpm-${user.id}`).value)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleBan(user.id, user.status)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                      user.status === "banned" 
                      ? "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200" 
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {user.status === "banned" ? "Unban User" : "Ban User"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
