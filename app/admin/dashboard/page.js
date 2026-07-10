"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e14] p-6 text-white">
      {/* Admin Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Users", val: users.length },
          { title: "Total Links", val: "125,784" },
          { title: "Total Clicks", val: "25M+" },
          { title: "Total Paid", val: "$1.8M+" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#131722] border border-[#1f2937] p-5 rounded-2xl">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.title}</p>
            <p className="text-2xl font-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[#131722] border border-[#1f2937] rounded-2xl p-6">
        <h3 className="font-bold mb-6">Latest Users</h3>
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="border-b border-[#1f2937]">
            <tr>
              <th className="pb-3">EMAIL</th>
              <th className="pb-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#1f2937]/50">
                <td className="py-4 text-white font-bold">{user.email}</td>
                <td className="py-4 text-right text-emerald-400 uppercase text-xs font-bold">{user.status || "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
