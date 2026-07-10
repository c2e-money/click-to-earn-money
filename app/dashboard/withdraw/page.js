"use client";
export default function Withdraw() {
  return (
    <div className="min-h-screen bg-[#0b0e14] p-6 text-white">
      <h1 className="text-2xl font-black mb-6">My Wallet</h1>
      
      {/* Wallet Card */}
      <div className="bg-[#131722] border border-[#1f2937] p-8 rounded-2xl mb-6 shadow-lg">
        <p className="text-gray-400 text-xs font-bold uppercase">Available Balance</p>
        <p className="text-4xl font-black text-purple-400 mt-2">$1,250.75</p>
      </div>

      {/* Withdraw Box */}
      <div className="bg-[#131722] border border-[#1f2937] p-6 rounded-2xl">
        <h3 className="font-bold mb-4">Withdraw Funds</h3>
        <select className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg mb-4 text-white">
          <option>UPI</option>
          <option>PayPal</option>
        </select>
        <input type="text" placeholder="UPI ID" className="w-full bg-[#0b0e14] border border-[#1f2937] p-3 rounded-lg mb-4 text-white" />
        <button className="w-full bg-indigo-600 py-3 rounded-lg font-bold">REQUEST WITHDRAWAL</button>
      </div>
    </div>
  );
}
