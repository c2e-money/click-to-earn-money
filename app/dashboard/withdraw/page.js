"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar"; // Assuming you have this

export default function Withdraw() {
  const [method, setMethod] = useState("phonepe");
  const [history] = useState([
    { id: "WD-84729", amount: 50.00, type: "Bank", status: "Pending" },
    { id: "WD-10293", amount: 20.00, type: "PhonePe", status: "Completed" },
  ]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      {/* Header */}
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">WITHDRAW FUNDS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Withdraw Box */}
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] text-gray-500 font-bold uppercase">Available Balance</p>
          <p className="text-3xl font-black text-emerald-400 mb-6">$0.00</p>
          
          <div className="mb-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Select Payment Method</p>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm text-white outline-none"
            >
              <option value="phonepe">PhonePe</option>
              <option value="gpay">Google Pay</option>
              <option value="paytm">Paytm</option>
              <option value="anyupi">Any UPI</option>
              <option value="paypal">PayPal</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <input type="number" placeholder="Enter Amount ($)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />

          {/* Dynamic Fields */}
          <div className="space-y-3 mb-4">
            {method === "bank" ? (
              <>
                <input type="text" placeholder="Account Holder Name" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
                <input type="text" placeholder="Account Number" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
                <input type="text" placeholder="IFSC Code" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
                <input type="text" placeholder="Bank Name" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
              </>
            ) : method === "anyupi" ? (
              <input type="text" placeholder="Enter UPI ID" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
            ) : (
              <input type="text" placeholder={`Enter ${method.toUpperCase()} ID / Number`} className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm outline-none" />
            )}
          </div>

          <button className="w-full bg-emerald-600 p-3 rounded-xl font-black text-xs uppercase">Withdraw Now</button>
        </div>

        {/* History Section */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-500">Withdrawal History</p>
          {history.map((item) => (
            <div key={item.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">ID: #{item.id}</p>
                <p className="text-xs font-black text-white">${item.amount.toFixed(2)} via {item.type}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${item.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </main>

      <Navbar active="withdraw" />
    </div>
  );
            }
              
