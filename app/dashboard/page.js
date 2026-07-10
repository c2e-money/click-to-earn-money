"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        if (doc.exists()) setUserData(doc.data());
      });
      return () => unsub();
    }
  }, []);

  if (!userData) return <div className="text-white p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] p-6">
      <h1 className="text-2xl font-black text-white mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "WALLET", val: `$${userData.walletBalance?.toFixed(2)}`, color: "text-white" },
          { label: "CPM", val: `$${userData.cpm?.toFixed(2)}`, color: "text-emerald-400" },
          { label: "TOTAL EARNING", val: `$${userData.totalEarnings?.toFixed(2)}`, color: "text-purple-400" },
          { label: "TOTAL CLICKS", val: userData.totalClicks, color: "text-blue-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#131722] border border-[#1f2937] p-5 rounded-2xl shadow-lg">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Recent Links Table */}
      <div className="bg-[#131722] border border-[#1f2937] rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4">Recent Links</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="border-b border-[#1f2937]">
              <tr>
                <th className="pb-3 uppercase">Link</th>
                <th className="pb-3 uppercase text-right">Clicks</th>
                <th className="pb-3 uppercase text-right">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {/* Yahan aapka links ka data aayega */}
              <tr className="border-b border-[#1f2937]/50">
                <td className="py-4 text-white">example-link.com</td>
                <td className="py-4 text-right">1,234</td>
                <td className="py-4 text-right text-emerald-400">$3.25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
