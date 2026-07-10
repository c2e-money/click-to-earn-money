"use client";
export default function Admin() {
  return (
    <main className="p-6 bg-[#0b0e14] min-h-screen text-white">
      <h1 className="text-xl font-black italic uppercase mb-8">Admin Control</h1>

      {/* Admin Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] text-gray-500 font-bold uppercase">Total Users</p><p className="text-lg font-black">2,402</p></div>
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]"><p className="text-[9px] text-gray-500 font-bold uppercase">Pending Payouts</p><p className="text-lg font-black text-purple-400">$840</p></div>
      </div>

      {/* Users Table */}
      <div className="bg-[#131722] rounded-2xl border border-[#1f2937] overflow-hidden">
        <div className="px-4 py-3 bg-[#191f30] text-[9px] font-black text-gray-500 uppercase">Recent Withdrawals</div>
        <div className="px-4 py-4 text-xs font-bold border-b border-[#1f2937] flex justify-between">
          <span>User_8812</span><span className="text-emerald-500">$45.20</span>
        </div>
      </div>
    </main>
  );
}
