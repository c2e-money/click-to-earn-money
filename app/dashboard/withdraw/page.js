"use client";
export default function Withdraw() {
  return (
    <main className="p-6 pb-24 bg-[#0b0e14] min-h-screen text-white">
      <h1 className="text-xl font-black italic uppercase mb-8">Withdraw Funds</h1>
      
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#1a1c29] to-[#131722] p-8 rounded-3xl border border-[#1f2937] mb-6 shadow-2xl text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Available Balance</p>
        <p className="text-5xl font-black text-emerald-400 my-3">$0.00</p>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-[#131722] p-6 rounded-3xl border border-[#1f2937] space-y-4">
        <select className="w-full bg-[#0b0e14] border border-[#1f2937] p-4 rounded-xl font-black text-sm">
          <option>UPI / PHONEPE</option>
          <option>PAYTM WALLET</option>
          <option>USDT TRC20</option>
        </select>
        <input type="text" placeholder="Enter Payment Address" className="w-full bg-[#0b0e14] border border-[#1f2937] p-4 rounded-xl text-sm" />
        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl font-black text-sm uppercase">Request Withdrawal</button>
      </div>
    </main>
  );
}
