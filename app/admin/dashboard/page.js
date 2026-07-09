"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [globalCPM, setGlobalCPM] = useState(5.00); // $5 Default System CPM

  // Security Check: Agar direct URL se aaya to wapas login par bhejo
  useEffect(() => {
    if (localStorage.getItem("lg_admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center bg-slate-900 text-white p-5 rounded-t-lg shadow">
        <h2 className="text-2xl font-extrabold tracking-wider">⚙️ LG Master Control</h2>
        <button onClick={() => { localStorage.removeItem("lg_admin_auth"); router.push("/admin"); }} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-bold transition">
          Secure Logout
        </button>
      </div>

      <div className="bg-white p-6 shadow-xl rounded-b-lg space-y-8 border border-slate-200">
        
        {/* 1. Global CPM Settings */}
        <div className="border border-slate-200 p-5 rounded-lg bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 mb-3">Global CPM Setting ($)</h3>
          <div className="flex gap-4">
            <input type="number" value={globalCPM} onChange={(e) => setGlobalCPM(e.target.value)} className="border border-slate-300 px-4 py-2 rounded w-32 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition">Update System CPM</button>
          </div>
        </div>

        {/* 2. User Management (Ban & Per-User CPM) */}
        <div>
          <h3 className="font-bold text-lg text-slate-800 mb-3">User Management</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left bg-white">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold text-slate-700">User Email</th>
                  <th className="p-3 font-semibold text-slate-700">Status</th>
                  <th className="p-3 font-semibold text-slate-700">Custom CPM ($)</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-slate-50">
                  <td className="p-3 text-slate-600">publisher1@gmail.com</td>
                  <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
                  <td className="p-3 flex items-center gap-2">
                    <input type="number" defaultValue="5.50" className="border border-slate-300 w-20 px-2 py-1 rounded outline-none" /> 
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Save</button>
                  </td>
                  <td className="p-3 text-right">
                    <button className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm font-bold transition border border-red-200">Ban User</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Withdrawal Requests System */}
        <div>
          <h3 className="font-bold text-lg text-slate-800 mb-3">Pending Withdrawals</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left bg-white">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold text-slate-700">Email</th>
                  <th className="p-3 font-semibold text-slate-700">Method</th>
                  <th className="p-3 font-semibold text-slate-700">Payment Details</th>
                  <th className="p-3 font-semibold text-slate-700">Amount</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-slate-50">
                  <td className="p-3 text-slate-600">publisher2@gmail.com</td>
                  <td className="p-3 font-bold text-indigo-600">bKash</td>
                  <td className="p-3 text-sm text-slate-500">+8801900000000</td>
                  <td className="p-3 font-bold text-slate-800">$15.00</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold transition">Approve</button>
                    <button className="bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 px-3 py-1 rounded text-sm font-bold transition">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
                                                              }
          
